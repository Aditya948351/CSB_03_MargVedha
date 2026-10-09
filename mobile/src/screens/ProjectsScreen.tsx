import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme';
import { Layers, ShieldCheck, ShieldAlert, GitBranch } from 'lucide-react-native';

export default function ProjectsScreen() {
  const { projects } = useAppStore();

  const renderItem = ({ item }: any) => {
    const isSecure = item.finding_count === 0;

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <GitBranch color={colors.primary} size={20} />
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <View style={[styles.statusBadge, isSecure ? styles.statusSecure : styles.statusAtRisk]}>
            <Text style={[styles.statusText, isSecure ? styles.statusSecureText : styles.statusAtRiskText]}>
              {isSecure ? 'SECURE' : 'AT RISK'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Findings</Text>
            <View style={styles.findingCountRow}>
              {isSecure ? (
                <ShieldCheck color={colors.success} size={16} />
              ) : (
                <ShieldAlert color={colors.danger} size={16} />
              )}
              <Text style={[styles.detailValue, !isSecure && { color: colors.danger }]}>
                {item.finding_count}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>Monitored</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={projects}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Layers color={colors.textMuted} size={48} />
            <Text style={styles.emptyText}>No projects monitored.</Text>
            <Text style={styles.emptySubtext}>Connect a repository from the web dashboard.</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusSecure: {
    backgroundColor: colors.success + '20',
  },
  statusAtRisk: {
    backgroundColor: colors.danger + '20',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  statusSecureText: {
    color: colors.success,
  },
  statusAtRiskText: {
    color: colors.danger,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  findingCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
