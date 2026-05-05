import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  User,
  Settings,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Clock,
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/Theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>Marc-Antoine</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <User color={COLORS.navy} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>SOLDE DISPONIBLE</Text>
          <Text style={styles.walletAmount}>
            12 450 000 <Text style={styles.currency}>FCFA</Text>
          </Text>
          <View style={styles.walletFooter}>
            <View style={styles.escrowIndicator}>
              <ShieldCheck color={COLORS.white} size={12} opacity={0.6} />
              <Text style={styles.escrowText}>Protégé par Escrow</Text>
            </View>
            <TouchableOpacity style={styles.payoutButton}>
              <Text style={styles.payoutButtonText}>RETIRER</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(0, 48, 135, 0.05)' }]}>
              <TrendingUp color={COLORS.navy} size={18} />
            </View>
            <Text style={styles.statValue}>98.2</Text>
            <Text style={styles.statLabel}>CONFIANCE</Text>
          </View>
          <View style={styles.statBox}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
              <MessageSquare color={COLORS.gold} size={18} />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>MESSAGES</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transactions Récentes</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>VOIR TOUT</Text>
          </TouchableOpacity>
        </View>

        {[
          {
            id: '1',
            title: 'Villa Cocody',
            date: 'Hier, 14:20',
            amount: '-125M',
            status: 'COMPLÉTE',
          },
          {
            id: '2',
            title: 'Caution Séjour',
            date: '12 Mai 2026',
            amount: '+450K',
            status: 'ESCROW',
          },
        ].map((item) => (
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.txIcon}>
              <Clock color={COLORS.mediumGray} size={16} />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txDate}>{item.date}</Text>
            </View>
            <View style={styles.txAmountContainer}>
              <Text style={styles.txAmount}>{item.amount}</Text>
              <Text style={styles.txStatus}>{item.status}</Text>
            </View>
          </View>
        ))}

        {/* Quick Links */}
        <Text style={[styles.sectionTitle, { marginTop: SPACING.xl, marginBottom: SPACING.md }]}>
          Paramètres & Sécurité
        </Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <CreditCard color={COLORS.gray} size={18} />
          </View>
          <Text style={styles.menuLabel}>Moyens de Paiement</Text>
          <Settings color={COLORS.mediumGray} size={16} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.mediumGray,
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.gray,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  walletCard: {
    backgroundColor: COLORS.navy,
    borderRadius: 32,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  walletLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  walletAmount: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: SPACING.lg,
  },
  currency: {
    fontSize: 14,
    opacity: 0.5,
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  escrowIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  escrowText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.6,
  },
  payoutButton: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  payoutButtonText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 24,
    padding: SPACING.lg,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.gray,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.mediumGray,
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.gray,
  },
  viewAll: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray,
  },
  txDate: {
    fontSize: 12,
    color: COLORS.mediumGray,
  },
  txAmountContainer: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.navy,
  },
  txStatus: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.success,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 20,
    gap: 12,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
});
