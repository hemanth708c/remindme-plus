// app/add-reminder.tsx
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { listPeople, Person } from '../db/repo/people';
import { addReminder } from '../db/repo/reminders';
import { scheduleLocalNotification } from '../lib/notifications';

function parseHHMM(hhmm: string): { ok: true; date: Date } | { ok: false } {
  const m = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return { ok: false };
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return { ok: false };

  const now = new Date();
  const d = new Date(now);
  d.setHours(hh, mm, 0, 0);
  if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1);
  return { ok: true, date: d };
}

export default function AddReminderScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('08:00');

  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  // load people every time screen is focused
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        try {
          const p = await listPeople();
          if (mounted) setPeople(p);
        } catch (err) {
          console.error('load people err', err);
        }
      })();
      return () => {
        mounted = false;
      };
    }, [])
  );

  function getSelectedPerson(): Person | undefined {
    return people.find((p) => p.id === selectedPersonId);
  }

  async function onSave() {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a title for the reminder.');
      return;
    }
    const parsed = parseHHMM(time);
    if (!parsed.ok) {
      Alert.alert('Invalid time', 'Please enter time in HH:MM (24-hour) format, e.g. 09:00 or 18:30');
      return;
    }

    try {
      const newId = await addReminder({
        title: title.trim(),
        description: description.trim(),
        icon: 'bell',
        schedule: { type: 'daily', times: [time.trim()] },
        personId: selectedPersonId ?? null,
      });

      try {
        await scheduleLocalNotification(
          `reminder-${newId}`,
          parsed.date,
          title.trim(),
          description.trim() || undefined
        );
      } catch (notifErr) {
        console.warn('Could not schedule notification:', notifErr);
      }

      Alert.alert('Saved', `Reminder "${title}" added for ${time}.`);
// Go to the Today screen explicitly so it reloads immediately
router.replace('/');

    } catch (err) {
      console.error('save reminder err', err);
      Alert.alert('Error', 'Could not save reminder. See console for details.');
    }
  }

  function renderPersonItem({ item }: { item: Person }) {
    const isSelected = item.id === selectedPersonId;
    return (
      <Pressable
        onPress={() => {
          setSelectedPersonId(item.id);
          setDropdownOpen(false);
        }}
        style={[styles.personRow, isSelected ? styles.personSelected : styles.personUnselected]}
      >
        <Text style={isSelected ? styles.personTextSelected : styles.personTextUnselected}>
          {item.name} {item.relation ? `• ${item.relation}` : ''}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Reminder</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Reminder title (e.g. Take BP tablet)"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Time (HH:MM)</Text>
      <TextInput
        style={styles.input}
        placeholder="08:00"
        value={time}
        keyboardType="numeric"
        onChangeText={setTime}
      />

      <Text style={[styles.label, { marginTop: 12 }]}>For</Text>

      {/* Dropdown trigger */}
      <Pressable
        onPress={() => setDropdownOpen((s) => !s)}
        style={[styles.dropdownTrigger, dropdownOpen ? styles.dropdownOpen : null]}
      >
        <Text style={getSelectedPerson() ? styles.dropdownTextSelected : styles.dropdownTextHint}>
          {getSelectedPerson() ? `${getSelectedPerson()!.name}${getSelectedPerson()!.relation ? ` • ${getSelectedPerson()!.relation}` : ''}` : 'Select person (optional)'}
        </Text>
        <Text style={styles.dropdownChevron}>{dropdownOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {/* Dropdown list */}
      {dropdownOpen && (
        <View style={styles.dropdownListContainer}>
          {people.length === 0 ? (
            <Text style={styles.emptyText}>No people yet — add one under People tab.</Text>
          ) : (
            <View style={{ maxHeight: 220 }}>
              <FlatList
                data={people}
                keyExtractor={(p) => p.id}
                renderItem={renderPersonItem}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
      )}

      <Pressable style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveBtnText}>Save Reminder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F7FB' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 18 },
  label: { marginTop: 10, marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 8,
  },

  // Dropdown
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownOpen: {
    borderColor: '#0b84ff',
    shadowColor: '#0b84ff',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdownTextHint: { color: '#666' },
  dropdownTextSelected: { color: '#000', fontWeight: '700' },
  dropdownChevron: { color: '#666', marginLeft: 8 },

  dropdownListContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  emptyText: { color: '#666', padding: 8 },

  personRow: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  personUnselected: {
    backgroundColor: '#fff',
  },
  personSelected: {
    backgroundColor: '#0b84ff',
  },
  personTextUnselected: {
    color: '#000',
  },
  personTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  saveBtn: {
    backgroundColor: '#0b84ff',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 18,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
