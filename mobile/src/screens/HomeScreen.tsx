import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppStore } from '../store';
import { colors } from '../theme';
import { ShieldAlert, Layers, Activity, ChevronRight } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  const { findings, projects, isLoading, fetchDashboardData } = useAppStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const criticalCount = findings.filter(f => f.severity >= 9.0).length;
  const highCount = findings.filter(f => f.severity >= 7.0 && f.severity < 9.0).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MARGVEDHA</Text>
        <Text style={styles.subtitle}>Trace the Risk, Secure the Path</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Layers color={colors.primary} size={24} />
              <Text style={styles.statValue}>{projects.length}</Text>
              <Text style={styles.statLabel}>Monitored Projects</Text>
            </View>
            <View style={[styles.statCard, { borderColor: colors.danger, borderWidth: 1 }]}>
              <ShieldAlert color={colors.danger} size={24} />
              <Text style={[styles.statValue, { color: colors.danger }]}>{criticalCount}</Text>
              <Text style={styles.statLabel}>Critical Risks</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Alerts</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {findings.slice(0, 3).map((finding) => (
              <TouchableOpacity 
                key={finding.id} 
                style={styles.alertCard}
                onPress={() => navigation.navigate('Alerts')}
              >
                <View style={styles.alertIcon}>
                  <ShieldAlert color={finding.severity >= 9.0 ? colors.danger : colors.warning} size={20} />
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{finding.package}</Text>
                  <Text style={styles.alertSubtitle}>{finding.id}</Text>
                </View>
                <ChevronRight color={colors.textMuted} size={20} />
              </TouchableOpacity>
            ))}
            
            {findings.length === 0 && (
              <Text style={styles.emptyText}>No vulnerabilities detected.</Text>
            )}
          </View>
          
          <View style={styles.section}>
             <View style={styles.actionCard}>
                <Activity color={colors.success} size={24} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: 'bold' }}>System Status: Operational</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Last scan completed recently.</Text>
                </View>
             </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 14,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  }
});
