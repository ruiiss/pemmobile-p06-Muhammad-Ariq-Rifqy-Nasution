import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const COLORS = {
  primary: '#408A71',
  bg: '#F8F7FF',
  card: '#FFFFFF',
  text: '#2D2D3A',
  subtext: '#8E8EA0',
  border: '#EBEBF5',
};

export default function SearchBar({ value, onChangeText, onClear }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder="Cari produk..."
        placeholderTextColor={COLORS.subtext}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#408A71',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 12,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: COLORS.bg,
  },
  clearIcon: {
    fontSize: 12,
    color: COLORS.subtext,
    fontWeight: '700',
  },
});
