import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bike,
  ChevronLeft,
  ChevronRight,
  Disc,
  Droplet,
  Eye,
  FileText,
  Gauge,
  Handshake,
  Headset,
  Heart,
  History,
  Images,
  type LucideIcon,
  MessageCircle,
  Package,
  Play,
  ShoppingCart,
  Sparkles,
  Trophy,
  Truck,
  User,
  Users,
  Wrench,
  X,
  Zap,
  Moon,
  Sun,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  person: User,
  shopping_cart: ShoppingCart,
  add_shopping_cart: ShoppingCart,
  close: X,
  settings: Wrench,
  build: Wrench,
  build_circle: Wrench,
  arrow_back: ArrowLeft,
  arrow_forward: ArrowRight,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  visibility: Eye,
  collections: Images,
  article: FileText,
  play_arrow: Play,
  favorite: Heart,
  chat: MessageCircle,
  two_wheeler: Bike,
  moped: Bike,
  electric_moped: Zap,
  sports_motorsports: Gauge,
  history: History,
  inventory_2: Package,
  verified: BadgeCheck,
  local_shipping: Truck,
  support_agent: Headset,
  emoji_events: Trophy,
  celebration: Sparkles,
  water_drop: Droplet,
  disc_full: Disc,
  handshake: Handshake,
  groups: Users,
  light_mode: Sun,
  dark_mode: Moon,
};

interface MaterialIconProps {
  name: string;
  className?: string;
}

export function MaterialIcon({ name, className = "" }: MaterialIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;

  const m = className.match(/(?:!?\s*)text-\[(\d+)px\]/);
  const size = m ? Number.parseInt(m[1], 10) : undefined;
  const clean = className.replace(/\s*!?text-\[\d+px\]\s*/g, " ").trim();

  return <Icon className={clean} size={size} />;
}
