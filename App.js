import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import products from './data/products';
import ProductCard from './components/ProductCard';
import SearchBar from './components/SearchBar';

// ─── Constants ──────────────────────────────────────────
const COLORS = {
  primary: '#408A71',
  accent: '#FF6584',
  bg: '#F8F7FF',
  card: '#FFFFFF',
  text: '#2D2D3A',
  subtext: '#8E8EA0',
  border: '#EBEBF5',
  chipActive: '#6C63FF',
  chipInactive: '#FFFFFF',
};

const CATEGORIES = ['Semua', 'Pakaian', 'Sepatu', 'Aksesoris'];
const SORT_OPTIONS = [
  { key: 'default', label: 'Default' },
  { key: 'price_asc', label: 'Harga ↑' },
  { key: 'price_desc', label: 'Harga ↓' },
  { key: 'rating', label: 'Rating ↑' },
];

// ─── App ────────────────────────────────────────────────
export default function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortKey, setSortKey] = useState('default');
  const [isGrid, setIsGrid] = useState(false);
  const [isSectionMode, setIsSectionMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ── Filtered + Sorted Data ──────────────────────────
  const filtered = useMemo(() => {
    let data = [...products];

    if (activeCategory !== 'Semua') {
      data = data.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (sortKey === 'price_asc') data.sort((a, b) => a.price - b.price);
    else if (sortKey === 'price_desc') data.sort((a, b) => b.price - a.price);
    else if (sortKey === 'rating') data.sort((a, b) => b.rating - a.rating);

    return data;
  }, [search, activeCategory, sortKey]);

  // ── SectionList Data ────────────────────────────────
  const sections = useMemo(() => {
    const grouped = {};
    filtered.forEach((p) => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [filtered]);

  // ── Pull to Refresh ─────────────────────────────────
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setSearch('');
      setActiveCategory('Semua');
      setSortKey('default');
      setRefreshing(false);
    }, 1200);
  }, []);

  // ── Empty State ─────────────────────────────────────
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Produk Tidak Ditemukan</Text>
      <Text style={styles.emptyHint}>
        Coba ubah kata kunci pencarian atau pilih kategori lain
      </Text>
    </View>
  );

  // ── Render Item ─────────────────────────────────────
  const renderItem = useCallback(
    ({ item }) => <ProductCard item={item} isGrid={isGrid} />,
    [isGrid]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // ── Header ──────────────────────────────────────────
  const ListHeader = (
    <View>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View>
          <Text style={styles.appTitle}>🛍️ ShopList</Text>
          <Text style={styles.appSubtitle}>{filtered.length} produk ditemukan</Text>
        </View>
        <View style={styles.headerActions}>
          {/* Section Toggle */}
          <TouchableOpacity
            style={[styles.iconBtn, isSectionMode && styles.iconBtnActive]}
            onPress={() => setIsSectionMode((v) => !v)}
          >
            <Text style={styles.iconBtnText}>§</Text>
          </TouchableOpacity>
          {/* Grid Toggle */}
          <TouchableOpacity
            style={[styles.iconBtn, isGrid && styles.iconBtnActive]}
            onPress={() => setIsGrid((v) => !v)}
          >
            <Text style={styles.iconBtnText}>{isGrid ? '☰' : '▦'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
      />

      {/* Category Chips */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.chipList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, activeCategory === item && styles.chipActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text
              style={[
                styles.chipText,
                activeCategory === item && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Sort Options */}
      <FlatList
        data={SORT_OPTIONS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.sortList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.sortBtn, sortKey === item.key && styles.sortBtnActive]}
            onPress={() => setSortKey(item.key)}
          >
            <Text
              style={[
                styles.sortText,
                sortKey === item.key && styles.sortTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // ─── Render ──────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {isSectionMode ? (
        // ── SectionList Mode (E3) ──────────────────────
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => (
            <ProductCard item={item} isGrid={false} />
          )}
          renderSectionHeader={({ section: { title, data } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionCount}>{data.length} produk</Text>
            </View>
          )}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyState}
          onRefresh={onRefresh}
          refreshing={refreshing}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
        />
      ) : (
        // ── FlatList Mode (List / Grid) ───────────────
        <FlatList
          key={isGrid ? 'grid' : 'list'}
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={isGrid ? 2 : 1}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={EmptyState}
          onRefresh={onRefresh}
          refreshing={refreshing}
          contentContainerStyle={[
            styles.listContent,
            isGrid && styles.gridContent,
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // App Header
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: COLORS.subtext,
    fontWeight: '500',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  iconBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  iconBtnText: {
    fontSize: 16,
    color: COLORS.text,
  },

  // Chips
  chipList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.subtext,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // Sort
  sortList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  sortBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  sortBtnActive: {
    backgroundColor: '#EEF0FF',
    borderColor: COLORS.primary,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.subtext,
  },
  sortTextActive: {
    color: COLORS.primary,
  },

  // List
  listContent: {
    paddingBottom: 24,
  },
  gridContent: {
    paddingHorizontal: 10,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  sectionCount: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: '600',
  },
});
