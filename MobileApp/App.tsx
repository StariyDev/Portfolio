import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert as RNAlert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Server {
  id: string;
  name: string;
  ip: string;
  status: 'Online' | 'Warning' | 'Critical';
  uptime: string;
  cpu: number;
  ram: number;
  disk: number;
}

interface Alert {
  id: string;
  serverId: string;
  serverName: string;
  message: string;
  type: 'Warning' | 'Critical';
  timestamp: string;
  acknowledged: boolean;
}

interface ServiceTask {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'restarting';
  uptime: string;
  logs: string[];
}

// ==========================================
// INITIAL MOCK DATA
// ==========================================
const INITIAL_SERVERS: Server[] = [
  { id: '1', name: 'Node-01.prod.cloud', ip: '192.168.1.10', status: 'Online', uptime: '14d 6h 12m', cpu: 42, ram: 64, disk: 78 },
  { id: '2', name: 'Node-02.api.cloud', ip: '192.168.1.11', status: 'Warning', uptime: '32d 12h 4m', cpu: 84, ram: 91, disk: 54 },
  { id: '3', name: 'Db-master.storage', ip: '192.168.1.20', status: 'Online', uptime: '124d 1h 45m', cpu: 22, ram: 45, disk: 32 },
  { id: '4', name: 'Cache-redis.prod', ip: '192.168.1.30', status: 'Critical', uptime: '3d 18h 5m', cpu: 96, ram: 98, disk: 89 },
];

const INITIAL_ALERTS: Alert[] = [
  { id: 'a1', serverId: '4', serverName: 'Cache-redis.prod', message: 'Memory consumption exceeds 95%', type: 'Critical', timestamp: '11:42:04', acknowledged: false },
  { id: 'a2', serverId: '2', serverName: 'Node-02.api.cloud', message: 'CPU temperature spike: 82°C', type: 'Warning', timestamp: '11:39:15', acknowledged: false },
  { id: 'a3', serverId: '1', serverName: 'Node-01.prod.cloud', message: 'Nginx process high response time', type: 'Warning', timestamp: '11:15:00', acknowledged: true },
];

const INITIAL_SERVICES: ServiceTask[] = [
  { id: 's1', name: 'nginx.service', status: 'running', uptime: '14d 6h', logs: ['[nginx] listening on port 80', '[nginx] configuration reloaded successfully', '[nginx] incoming request GET /api/v1/health - 200 OK'] },
  { id: 's2', name: 'docker-daemon', status: 'running', uptime: '32d 12h', logs: ['[docker] daemon started', '[docker] container node-01 started', '[docker] network bridge created'] },
  { id: 's3', name: 'postgresql@15', status: 'running', uptime: '124d 1h', logs: ['[postgres] database system is ready to accept connections', '[postgres] autovacuum launcher started', '[postgres] connection received: host=192.168.1.10 port=42516'] },
  { id: 's4', name: 'redis-cache-service', status: 'stopped', uptime: '0s', logs: ['[redis] server is shutting down', '[redis] saving DB to disk on SIGTERM', '[redis] bye!'] },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'runner'>('dashboard');
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [services, setServices] = useState<ServiceTask[]>(INITIAL_SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('s1');
  
  const terminalScrollViewRef = useRef<ScrollView>(null);

  // ==========================================
  // REAL-TIME HEARTBEAT SIMULATOR
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Randomly fluctuate server metrics
      setServers(prevServers =>
        prevServers.map(server => {
          const cpuDelta = Math.floor(Math.random() * 15) - 7; // -7 to +7
          const ramDelta = Math.floor(Math.random() * 7) - 3;  // -3 to +3
          
          let nextCpu = Math.max(5, Math.min(100, server.cpu + cpuDelta));
          let nextRam = Math.max(10, Math.min(100, server.ram + ramDelta));
          
          // Determine status based on load
          let nextStatus: Server['status'] = 'Online';
          if (nextCpu > 90 || nextRam > 95) {
            nextStatus = 'Critical';
          } else if (nextCpu > 75 || nextRam > 85) {
            nextStatus = 'Warning';
          }

          return {
            ...server,
            cpu: nextCpu,
            ram: nextRam,
            status: nextStatus,
          };
        })
      );

      // 2. Randomly add new server activity logs
      setServices(prevServices =>
        prevServices.map(service => {
          if (service.status === 'running') {
            const time = new Date().toLocaleTimeString();
            const randomLogs = [
              `Incoming connection processed at ${time}`,
              `Buffer synchronized successfully`,
              `Garbage collector ran, freed 24MB RAM`,
              `Heartbeat pulse response from server`,
            ];
            const newLog = `[${service.name.split('.')[0]}] ${randomLogs[Math.floor(Math.random() * randomLogs.length)]}`;
            return {
              ...service,
              logs: [...service.logs.slice(-15), newLog], // keep last 15 lines
            };
          }
          return service;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal when logs update
  useEffect(() => {
    if (terminalScrollViewRef.current) {
      setTimeout(() => {
        terminalScrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [services]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert => (alert.id === alertId ? { ...alert, acknowledged: true } : alert))
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const controlService = (serviceId: string, action: 'start' | 'stop' | 'restart') => {
    setServices(prev =>
      prev.map(service => {
        if (service.id === serviceId) {
          const time = new Date().toLocaleTimeString();
          let newStatus = service.status;
          let extraLogs = [...service.logs];

          if (action === 'start') {
            newStatus = 'running';
            extraLogs.push(`[system] SIGSTART received at ${time}`);
            extraLogs.push(`[${service.name.split('.')[0]}] service initialized successfully`);
          } else if (action === 'stop') {
            newStatus = 'stopped';
            extraLogs.push(`[system] SIGTERM received at ${time}`);
            extraLogs.push(`[${service.name.split('.')[0]}] process terminated`);
          } else if (action === 'restart') {
            newStatus = 'restarting';
            extraLogs.push(`[system] SIGHUP restart sequence triggered at ${time}`);
            
            // Emulate temporary restart state
            setTimeout(() => {
              setServices(current =>
                current.map(s =>
                  s.id === serviceId
                    ? {
                        ...s,
                        status: 'running',
                        logs: [...s.logs, `[${s.name.split('.')[0]}] reboot sequence completed. Service online.`],
                      }
                    : s
                )
              );
            }, 1500);
          }

          return {
            ...service,
            status: newStatus,
            logs: extraLogs,
          };
        }
        return service;
      })
    );
  };

  // Helper styles for status colors
  const getStatusColor = (status: 'Online' | 'Warning' | 'Critical') => {
    if (status === 'Online') return '#10b981'; // Emerald
    if (status === 'Warning') return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getPercentageColor = (percent: number) => {
    if (percent < 75) return '#10b981';
    if (percent < 90) return '#f59e0b';
    return '#ef4444';
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Server Infrastructure</Text>
              <Text style={styles.sectionSubtitle}>{servers.length} Hosts Active</Text>
            </View>

            {servers.map(server => (
              <View key={server.id} style={styles.card}>
                {/* Server Header */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.serverName}>{server.name}</Text>
                    <Text style={styles.serverIp}>{server.ip} • Up {server.uptime}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(server.status)}20` }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(server.status)} ]} />
                    <Text style={[styles.statusText, { color: getStatusColor(server.status) }]}>{server.status}</Text>
                  </View>
                </View>

                {/* Metrics */}
                <View style={styles.metricsContainer}>
                  {/* CPU Metric */}
                  <View style={styles.metricRow}>
                    <View style={styles.metricLabelRow}>
                      <Text style={styles.metricName}>CPU Load</Text>
                      <Text style={[styles.metricValue, { color: getPercentageColor(server.cpu) }]}>{server.cpu}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${server.cpu}%`, backgroundColor: getPercentageColor(server.cpu) }]} />
                    </View>
                  </View>

                  {/* RAM Metric */}
                  <View style={styles.metricRow}>
                    <View style={styles.metricLabelRow}>
                      <Text style={styles.metricName}>RAM Usage</Text>
                      <Text style={[styles.metricValue, { color: getPercentageColor(server.ram) }]}>{server.ram}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${server.ram}%`, backgroundColor: getPercentageColor(server.ram) }]} />
                    </View>
                  </View>

                  {/* Disk Metric */}
                  <View style={styles.metricRow}>
                    <View style={styles.metricLabelRow}>
                      <Text style={styles.metricName}>Disk Space</Text>
                      <Text style={[styles.metricValue, { color: getPercentageColor(server.disk) }]}>{server.disk}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${server.disk}%`, backgroundColor: getPercentageColor(server.disk) }]} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        );

      case 'alerts':
        const unackCount = alerts.filter(a => !a.acknowledged).length;
        return (
          <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Incident Center</Text>
              <Text style={styles.sectionSubtitle}>{unackCount} Unresolved</Text>
            </View>

            {alerts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="shield" size={48} color="#64748b" />
                <Text style={styles.emptyText}>No incidents detected. System is stable.</Text>
              </View>
            ) : (
              alerts.map(alert => (
                <View key={alert.id} style={[styles.alertCard, alert.acknowledged && styles.alertAcknowledged]}>
                  {/* Alert Header */}
                  <View style={styles.alertCardHeader}>
                    <View style={styles.alertTitleGroup}>
                      <Ionicons
                        name={alert.type === 'Critical' ? 'alert-circle' : 'warning'}
                        size={20}
                        color={alert.type === 'Critical' ? '#ef4444' : '#f59e0b'}
                      />
                      <Text style={styles.alertServerName}>{alert.serverName}</Text>
                    </View>
                    <Text style={styles.alertTime}>{alert.timestamp}</Text>
                  </View>

                  <Text style={styles.alertMessage}>{alert.message}</Text>

                  {/* Actions */}
                  <View style={styles.alertActionsRow}>
                    {!alert.acknowledged ? (
                      <Pressable
                        style={({ pressed }) => [
                          styles.alertActionBtn,
                          styles.alertBtnAck,
                          pressed && styles.btnPressedOpacity,
                        ]}
                        onPress={() => acknowledgeAlert(alert.id)}
                      >
                        <Feather name="check-square" size={14} color="#10b981" />
                        <Text style={styles.alertBtnTextAck}>Acknowledge</Text>
                      </Pressable>
                    ) : (
                      <View style={styles.ackBadge}>
                        <Feather name="check" size={12} color="#64748b" />
                        <Text style={styles.ackText}>Acknowledged</Text>
                      </View>
                    )}

                    <Pressable
                      style={({ pressed }) => [
                        styles.alertActionBtn,
                        styles.alertBtnRestart,
                        pressed && styles.btnPressedOpacity,
                      ]}
                      onPress={() => {
                        // Restart task simulator for target server
                        const linkedService = services.find(s => s.id === 's1') || services[0];
                        controlService(linkedService.id, 'restart');
                        acknowledgeAlert(alert.id);
                        RNAlert.alert('System Alert', 'Service reboot signal successfully transmitted!');
                      }}
                    >
                      <Feather name="refresh-cw" size={12} color="#10b981" />
                      <Text style={styles.alertBtnTextRestart}>Restart Service</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.alertDeleteBtn,
                        pressed && styles.btnPressedOpacity,
                      ]}
                      onPress={() => deleteAlert(alert.id)}
                    >
                      <Feather name="trash-2" size={14} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        );

      case 'runner':
        const selectedService = services.find(s => s.id === selectedServiceId) || services[0];
        return (
          <View style={styles.containerRunner}>
            <ScrollView style={styles.servicesScroll} contentContainerStyle={styles.runnerContentPadding}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Task Runner</Text>
                <Text style={styles.sectionSubtitle}>DevOps Process Manager</Text>
              </View>

              {services.map(service => (
                <Pressable
                  key={service.id}
                  style={({ pressed }) => [
                    styles.serviceItem,
                    selectedServiceId === service.id && styles.serviceItemSelected,
                    pressed && Platform.OS === 'ios' && styles.btnPressedOpacity,
                  ]}
                  android_ripple={{ color: 'rgba(16, 185, 129, 0.15)' }}
                  onPress={() => setSelectedServiceId(service.id)}
                >
                  <View style={styles.serviceItemMain}>
                    <Feather
                      name={service.status === 'running' ? 'play-circle' : service.status === 'restarting' ? 'refresh-cw' : 'stop-circle'}
                      size={18}
                      color={service.status === 'running' ? '#10b981' : service.status === 'restarting' ? '#f59e0b' : '#64748b'}
                    />
                    <Text style={styles.serviceItemName}>{service.name}</Text>
                  </View>

                  <View style={styles.serviceItemActions}>
                    {service.status !== 'running' && (
                      <Pressable
                        style={({ pressed }) => [styles.miniControlBtn, pressed && styles.btnPressedOpacity]}
                        onPress={() => controlService(service.id, 'start')}
                      >
                        <Feather name="play" size={12} color="#10b981" />
                      </Pressable>
                    )}
                    {service.status === 'running' && (
                      <Pressable
                        style={({ pressed }) => [styles.miniControlBtn, pressed && styles.btnPressedOpacity]}
                        onPress={() => controlService(service.id, 'stop')}
                      >
                        <Feather name="square" size={12} color="#ef4444" />
                      </Pressable>
                    )}
                    <Pressable
                      style={({ pressed }) => [styles.miniControlBtn, pressed && styles.btnPressedOpacity]}
                      onPress={() => controlService(service.id, 'restart')}
                    >
                      <Feather name="refresh-cw" size={12} color="#38bdf8" />
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Terminal Logs Block */}
            <View style={styles.terminalContainer}>
              <View style={styles.terminalHeader}>
                <View style={styles.terminalIndicatorRow}>
                  <View style={styles.terminalDotRed} />
                  <View style={styles.terminalDotYellow} />
                  <View style={styles.terminalDotGreen} />
                </View>
                <Text style={styles.terminalTitle}>bash - stdout ({selectedService.name})</Text>
                {selectedService.status === 'restarting' && (
                  <ActivityIndicator size="small" color="#10b981" style={styles.terminalLoader} />
                )}
              </View>

              <ScrollView
                ref={terminalScrollViewRef}
                style={styles.terminalBody}
                contentContainerStyle={styles.terminalContent}
              >
                {selectedService.logs.map((log, index) => (
                  <Text key={index} style={styles.terminalLogLine}>
                    <Text style={styles.terminalLineNum}>[{(index + 1).toString().padStart(2, '0')}]</Text> {log}
                  </Text>
                ))}
              </ScrollView>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* App Header Bar */}
      <View style={styles.appHeader}>
        <View style={styles.logoRow}>
          <Feather name="activity" size={24} color="#10b981" />
          <Text style={styles.logoText}>Dev<Text style={{ color: '#10b981' }}>Ops</Text></Text>
        </View>
        <Text style={styles.logoSub}>Console v2.0</Text>
      </View>

      {/* Main Screen Body */}
      <View style={styles.body}>
        {renderContent()}
      </View>

      {/* Fluid Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab('dashboard')}
        >
          <Feather name="sliders" size={20} color={activeTab === 'dashboard' ? '#10b981' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'dashboard' && styles.navTextActive]}>Hosts</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab('alerts')}
        >
          <View>
            <Feather name="bell" size={20} color={activeTab === 'alerts' ? '#10b981' : '#64748b'} />
            {alerts.filter(a => !a.acknowledged).length > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{alerts.filter(a => !a.acknowledged).length}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navText, activeTab === 'alerts' && styles.navTextActive]}>Alerts</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => setActiveTab('runner')}
        >
          <Feather name="terminal" size={20} color={activeTab === 'runner' ? '#10b981' : '#64748b'} />
          <Text style={[styles.navText, activeTab === 'runner' && styles.navTextActive]}>Runner</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a', // deep navy slate
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Outfit' : 'sans-serif-medium',
  },
  logoSub: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  body: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Servers Dashboard Card
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  serverIp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricsContainer: {
    gap: 12,
  },
  metricRow: {
    width: '100%',
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  metricName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Alerts Screen
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 20,
  },
  alertCard: {
    backgroundColor: '#1e293b',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderTopColor: '#334155',
    borderRightColor: '#334155',
    borderBottomColor: '#334155',
  },
  alertAcknowledged: {
    borderLeftColor: '#64748b',
    opacity: 0.6,
  },
  alertCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertServerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  alertTime: {
    fontSize: 11,
    color: '#64748b',
  },
  alertMessage: {
    color: '#e2e8f0',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  alertActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  alertBtnAck: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  alertBtnTextAck: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  alertBtnRestart: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  alertBtnTextRestart: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  ackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  ackText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  alertDeleteBtn: {
    marginLeft: 'auto',
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Task Runner Tab Layout
  containerRunner: {
    flex: 1,
  },
  servicesScroll: {
    flex: 0.5,
  },
  runnerContentPadding: {
    padding: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serviceItemSelected: {
    borderColor: '#10b981',
    backgroundColor: '#1e2e3f',
  },
  serviceItemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  serviceItemName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  serviceItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  miniControlBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },

  // Terminal Styled Logs Widget
  terminalContainer: {
    flex: 0.5,
    backgroundColor: '#020617',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  terminalIndicatorRow: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 12,
  },
  terminalDotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444' },
  terminalDotYellow: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f59e0b' },
  terminalDotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981' },
  terminalTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: 'bold',
  },
  terminalLoader: {
    marginLeft: 8,
  },
  terminalBody: {
    flex: 1,
    padding: 16,
  },
  terminalContent: {
    paddingBottom: 24,
  },
  terminalLogLine: {
    color: '#38bdf8',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    lineHeight: 18,
    marginBottom: 4,
  },
  terminalLineNum: {
    color: '#475569',
  },

  // Navigation Items
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  navText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#10b981',
  },
  badgeCount: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  btnPressedOpacity: {
    opacity: 0.7,
  },
});
