import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const COLORS = {
  primary: '#000000ff',
  accent: '#FF6584',
  bg: '#F8F7FF',
  card: '#FFFFFF',
  text: '#2D2D3A',
  subtext: '#8E8EA0',
  star: '#FFB800',
  badge: '#B0E4CC',
  badgeText: '#285A48',
  border: '#B0E4CC',
};

const formatPrice = (price) =>
  'Rp ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '½';
  return stars;
};

export default function ProductCard({ item, isGrid }) {
  if (isGrid) {
    return (
      <TouchableOpacity style={styles.gridCard} activeOpacity={0.85}>
        <View style={styles.gridImageBox}>
          <Text style={styles.gridEmoji}>{item.image}</Text>
        </View>
        <View style={styles.gridBody}>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{item.category}</Text>
          </View>
          <Text style={styles.gridName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.gridPrice}>{formatPrice(item.price)}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>{renderStars(item.rating)}</Text>
            <Text style={styles.ratingNum}>{item.rating}</Text>
          </View>
          <Text style={styles.sold}>{item.sold.toLocaleString()} terjual</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.listCard} activeOpacity={0.85}>
      <View style={styles.listImageBox}>
        <Text style={styles.listEmoji}>{item.image}</Text>
      </View>
      <View style={styles.listBody}>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{item.category}</Text>
        </View>
        <Text style={styles.listName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.listPrice}>{formatPrice(item.price)}</Text>
        <View style={styles.listMeta}>
          <Text style={styles.stars}>{renderStars(item.rating)}</Text>
          <Text style={styles.ratingNum}>{item.rating}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.sold}>{item.sold.toLocaleString()} terjual</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ── List Card ─────────────────────────────────────
  listCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listImageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listEmoji: {
    fontSize: 38,
  },
  listBody: {
    flex: 1,
    justifyContent: 'center',
  },
  listName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  listPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // ── Grid Card ─────────────────────────────────────
  gridCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    margin: 6,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gridImageBox: {
    backgroundColor: COLORS.bg,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridEmoji: {
    fontSize: 50,
  },
  gridBody: {
    padding: 10,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },

  // ── Shared ────────────────────────────────────────
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.badgeText,
    backgroundColor: COLORS.badge,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  stars: {
    fontSize: 12,
    color: COLORS.star,
  },
  ratingNum: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: '600',
  },
  dot: {
    color: COLORS.subtext,
    fontSize: 12,
  },
  sold: {
    fontSize: 11,
    color: COLORS.subtext,
  },
});
