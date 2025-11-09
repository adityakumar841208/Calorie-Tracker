// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Add mappings from SF Symbol names (used in some UIs) to MaterialIcons names.
const MAPPING: Record<string, string> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'bell': 'notifications',
  'drop.fill': 'opacity',
  'fork.knife': 'restaurant',
  'leaf.fill': 'eco',
  'bell.fill': 'notifications',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  // older code passed `weight` for SF Symbols; accept it but ignore at runtime
  weight?: string | number | undefined;
}) {
  const mapped = MAPPING[name] ?? name;
  // MaterialIcons `name` prop expects a known icon name; cast to any to accept
  // custom strings or mapped names without strict typing.
  return <MaterialIcons color={color} size={size} name={mapped as any} style={style} />;
}
