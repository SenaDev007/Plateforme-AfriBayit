import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  BedDouble,
  Bath,
  Square,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/Theme';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen({ route, navigation }: any) {
  // Mock data for now
  const property = {
    title: 'Villa Contemporaine Fidjrossè',
    city: 'Cotonou',
    country: 'Bénin',
    price: '125 000 000',
    currency: 'FCFA',
    bedrooms: 5,
    bathrooms: 4,
    surface: 450,
    description:
      "Une villa d'exception située dans le quartier prisé de Fidjrossè, à seulement 5 minutes de la plage. Architecture moderne, finitions haut de gamme et sécurité assurée.",
    isVerified: true,
    features: ['Piscine', 'Garage 2 places', 'Système Solaire', 'Cuisine Équipée'],
    agent: {
      name: 'Marc-Antoine KOFFI',
      role: 'Agent Certifié AfriBayit',
      rating: 4.9,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Gallery Placeholder */}
        <View style={styles.gallery}>
          <View style={styles.imagePlaceholder} />
          <SafeAreaView style={styles.galleryOverlay}>
            <View style={styles.galleryHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleButton}>
                <ChevronLeft color={COLORS.gray} size={20} />
              </TouchableOpacity>
              <View style={styles.galleryActions}>
                <TouchableOpacity style={styles.circleButton}>
                  <Share2 color={COLORS.gray} size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleButton}>
                  <Heart color={COLORS.gray} size={18} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{property.title}</Text>
              <View style={styles.locationContainer}>
                <MapPin color={COLORS.mediumGray} size={12} />
                <Text style={styles.location}>
                  {property.city}, {property.country}
                </Text>
              </View>
            </View>
            {property.isVerified && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck color={COLORS.success} size={16} />
                <Text style={styles.verifiedText}>GÉO-VÉRIFIÉ</Text>
              </View>
            )}
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {property.price} <Text style={styles.currency}>{property.currency}</Text>
            </Text>
            <View style={styles.purposeBadge}>
              <Text style={styles.purposeText}>À VENDRE</Text>
            </View>
          </View>

          {/* Specs */}
          <View style={styles.specs}>
            <View style={styles.specItem}>
              <BedDouble color={COLORS.navy} size={20} />
              <Text style={styles.specValue}>{property.bedrooms}</Text>
              <Text style={styles.specLabel}>Chambres</Text>
            </View>
            <View style={styles.specItem}>
              <Bath color={COLORS.navy} size={20} />
              <Text style={styles.specValue}>{property.bathrooms}</Text>
              <Text style={styles.specLabel}>Bains</Text>
            </View>
            <View style={styles.specItem}>
              <Square color={COLORS.navy} size={20} />
              <Text style={styles.specValue}>{property.surface}</Text>
              <Text style={styles.specLabel}>m²</Text>
            </View>
          </View>

          {/* Trust Banner */}
          <View style={styles.trustBanner}>
            <View style={styles.trustHeader}>
              <ShieldCheck color={COLORS.gold} size={20} />
              <Text style={styles.trustTitle}>SÉCURITÉ AFRIBAYIT</Text>
            </View>
            <Text style={styles.trustDesc}>
              Cette transaction bénéficie du séquestre inviolable. Les fonds ne sont libérés
              qu'après validation juridique.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>

          <Text style={styles.sectionTitle}>Équipements</Text>
          <View style={styles.featuresGrid}>
            {property.features.map((feature, i) => (
              <View key={i} style={styles.featureItem}>
                <CheckCircle2 color={COLORS.success} size={14} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Agent Card */}
          <View style={styles.agentCard}>
            <View style={styles.agentAvatar} />
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>{property.agent.name}</Text>
              <Text style={styles.agentRole}>{property.agent.role}</Text>
            </View>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>CONTACTER</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomLabel}>Mensualité estimée</Text>
          <Text style={styles.bottomPrice}>850 000 FCFA/mois</Text>
        </View>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>DÉMARRER L'ACHAT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  gallery: {
    height: 350,
    backgroundColor: COLORS.gray,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#333',
  },
  galleryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  galleryActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  content: {
    padding: SPACING.lg,
    marginTop: -30,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.gray,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: COLORS.mediumGray,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 166, 81, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.navy,
  },
  currency: {
    fontSize: 14,
    opacity: 0.5,
  },
  purposeBadge: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  purposeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  specs: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  specItem: {
    alignItems: 'center',
    flex: 1,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray,
    marginTop: 4,
  },
  specLabel: {
    fontSize: 10,
    color: COLORS.mediumGray,
    fontWeight: '600',
  },
  trustBanner: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  trustTitle: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  trustDesc: {
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.gray,
    opacity: 0.7,
    marginBottom: SPACING.xl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: (width - 64) / 2,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.gray,
    fontWeight: '500',
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: SPACING.md,
    borderRadius: 20,
    gap: 12,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.mediumGray,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gray,
  },
  agentRole: {
    fontSize: 12,
    color: COLORS.mediumGray,
  },
  messageButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  messageButtonText: {
    color: COLORS.navy,
    fontSize: 10,
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    gap: SPACING.lg,
  },
  bottomInfo: {
    flex: 1,
  },
  bottomLabel: {
    fontSize: 10,
    color: COLORS.mediumGray,
    fontWeight: '600',
  },
  bottomPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gray,
  },
  buyButton: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buyButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
