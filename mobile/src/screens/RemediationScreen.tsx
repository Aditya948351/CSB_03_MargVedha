import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme';
import { Wrench, CheckCircle } from 'lucide-react-native';

export default function RemediationScreen() {
  const { findings, markAsResolved } = useAppStore();

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Wrench color={colors.primary} size={20} />
          <Text style={styles.title}>{item.package}</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.cve}>{item.id}</Text>
        </View>

        <Text style={styles.instruction}>
          Suggested action: <Text style={{ color: colors.text }}>Upgrade {item.package} to the latest version.</Text>
        </Text>

        <TouchableOpacity 
          style={styles.resolveButton}
          onPress={() => markAsResolved(item.id)}
        >
          <CheckCircle color={colors.background} size={18} />
          <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={findings}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CheckCircle color={colors.success} size={48} />
            <Text style={styles.emptyText}>All Clear!</Text>
            <Text style={styles.emptySubtext}>No pending remediation tasks.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  cve: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: 'bold',
  },
  instruction: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  resolveButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  }
});
