import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme';
import { ShieldAlert, AlertTriangle, ChevronRight } from 'lucide-react-native';

export default function AlertsScreen() {
  const { findings } = useAppStore();

  const renderItem = ({ item }: any) => {
    const isCritical = item.severity >= 9.0;
    
    return (
      <TouchableOpacity style={styles.alertCard}>
        <View style={[styles.severityStrip, { backgroundColor: isCritical ? colors.danger : colors.warning }]} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{isCritical ? 'CRITICAL' : 'HIGH'}</Text>
            </View>
            <Text style={styles.timeText}>Just now</Text>
          </View>
          
          <Text style={styles.title}>{item.id}</Text>
          <Text style={styles.packageText}>Package: <Text style={{ color: colors.primary }}>{item.package}</Text> v{item.version}</Text>
          
          <View style={styles.projectTag}>
            <Text style={styles.projectTagText}>Project: {item.affected_projects[0]}</Text>
          </View>
        </View>
        <ChevronRight color={colors.textMuted} size={20} style={{ marginRight: 16 }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={findings.sort((a, b) => b.severity - a.severity)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ShieldAlert color={colors.textMuted} size={48} />
            <Text style={styles.emptyText}>No alerts found.</Text>
            <Text style={styles.emptySubtext}>Your supply chain is currently secure.</Text>
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
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  severityStrip: {
    width: 6,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  packageText: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  projectTag: {
    backgroundColor: colors.primaryHover + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  projectTagText: {
    color: colors.primary,
    fontSize: 12,
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
