import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Search, Filter, MapPin, ShieldCheck, Heart } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/Theme';

const MOCK_DATA = [
  {
    id: '1',
    title: 'Villa Contemporaine Fidjrossè',
    city: 'Cotonou',
    price: '125 000 000 FCFA',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
    isVerified: true,
  },
  {
    id: '2',
    title: 'Appartement Haut Standing Cocody',
    city: 'Abidjan',
    price: '1 500 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
    isVerified: true,
  },
];

export default function SearchScreen({ navigation }: any) {
  const [search, setSearch] = useState('');

  const renderItem = ({ item }: { item: (typeof MOCK_DATA)[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PropertyDetail', { id: item.id })}
    >
      <View style={styles.cardImagePlaceholder}>
        <View style={styles.verifiedBadge}>
          <ShieldCheck color={COLORS.white} size={10} />
          <Text style={styles.verifiedText}>VÉRIFIÉ</Text>
        </View>
        <TouchableOpacity style={styles.heartButton}>
          <Heart color={COLORS.white} size={16} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardPrice}>{item.price}</Text>
          <View style={styles.locationContainer}>
            <MapPin color={COLORS.mediumGray} size={10} />
            <Text style={styles.cardLocation}>{item.city}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search color={COLORS.mediumGray} size={18} />
          <TextInput
            placeholder="Où cherchez-vous ?"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor={COLORS.mediumGray}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color={COLORS.navy} size={18} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        {['Tout', 'Villas', 'Apparts', 'Terrains'].map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.categoryPill, i === 0 && styles.categoryPillActive]}
          >
            <Text style={[styles.categoryText, i === 0 && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={MOCK_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.resultsCount}>24 propriétés trouvées</Text>}
      />
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
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderRadius: 24,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.lightGray,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
  },
  categoryPillActive: {
    backgroundColor: COLORS.navy,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mediumGray,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  list: {
    padding: SPACING.md,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  card: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  cardImagePlaceholder: {
    height: 200,
    backgroundColor: '#EEEEEE',
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.navy,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLocation: {
    fontSize: 10,
    color: COLORS.mediumGray,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
