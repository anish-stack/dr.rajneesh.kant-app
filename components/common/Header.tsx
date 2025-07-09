"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native"
import { scale, verticalScale, moderateScale } from "react-native-size-matters"
import Icon from "react-native-vector-icons/MaterialIcons"
import FastImage from "react-native-fast-image"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from "react-native-reanimated"
import { useService } from "../../hooks/use-service"
import { useAuth } from "../../context/AuthContext"
import { Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

const { width } = Dimensions.get("window")

const socialLinks = [
  {
    name: "facebook",
    icon: "facebook",
    url: "https://www.facebook.com/backtonaturespineclinicbydrrajneeshkant/",
    color: "#1877f2",
  },
  {
    name: "whatsapp",
    icon: "phone",
    url: "https://api.whatsapp.com/send?phone=91-9031554875",
    color: "#25d366",
  },
  {
    name: "instagram",
    icon: "camera-alt",
    url: "https://www.instagram.com/backtonaturespineclinic/",
    color: "#e4405f",
  },
  {
    name: "youtube",
    icon: "play-circle-filled",
    url: "https://www.youtube.com/@drrajneeshkant",
    color: "#ff0000",
  },
]

export default function Header({ isShown = true }: { isShown?: boolean; navigation?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { services } = useService()
  const { isAuthenticated, profileData: user } = useAuth()
  const navigation = useNavigation()
  // Animated values
  const menuAnimation = useSharedValue(0)
  const dropdownAnimation = useSharedValue(0)
  const hamburgerRotation = useSharedValue(0)
  const overlayOpacity = useSharedValue(0)

  const navigationItems = [
    { href: "/", label: "Home", icon: "home" },
    {
      href: "/treatments",
      label: "Treatments",
      icon: "medical-services",
      submenu: services || [
        { service_name: "Chiropractic Care", href: "/treatments/chiropractic" },
        { service_name: "Spine Therapy", href: "/treatments/spine" },
        { service_name: "Pain Management", href: "/treatments/pain" },
        { service_name: "Physical Therapy", href: "/treatments/physical" },
        { service_name: "Massage Therapy", href: "/treatments/massage" },
        { service_name: "Acupuncture", href: "/treatments/acupuncture" },
        { service_name: "Sports Injury", href: "/treatments/sports" },
        { service_name: "Rehabilitation", href: "/treatments/rehab" },
      ],
    },
    { href: "/pages/contact", label: "Contact", icon: "contact-phone" },
    { href: "/pages/gallery", label: "Gallery", icon: "photo-library" },
    { href: "/pages/about", label: "About", icon: "info" },
  ]

  const toggleMenu = () => {
    const newState = !isMenuOpen
    setIsMenuOpen(newState)

    if (newState) {
      menuAnimation.value = withSpring(1, { damping: 15, stiffness: 150 })
      hamburgerRotation.value = withTiming(1, { duration: 300 })
      overlayOpacity.value = withTiming(0.5, { duration: 300 })
    } else {
      menuAnimation.value = withSpring(0, { damping: 15, stiffness: 150 })
      hamburgerRotation.value = withTiming(0, { duration: 300 })
      overlayOpacity.value = withTiming(0, { duration: 300 })
      setActiveDropdown(null)
    }
  }

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null)
      dropdownAnimation.value = withTiming(0, { duration: 200 })
    } else {
      setActiveDropdown(label)
      dropdownAnimation.value = withTiming(1, { duration: 200 })
    }
  }

  const handleSocialPress = async (url: string) => {
    try {
      await Linking.openURL(url)
    } catch (error) {
      console.error("Failed to open URL:", error)
    }
  }

  const handleNavigation = (href: string) => {
    if (navigation) {
      console.log("Navigate to:", href)
    }
    toggleMenu() // Close menu after navigation
  }

  const handleBookNow = () => {
    // Handle book now functionality
    console.log("Book Now pressed")
    if (navigation) {
      navigation.navigate("booking-now")
    }
  }

  // Animated styles
  const menuAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(menuAnimation.value, [0, 1], [width, 0]),
      },
    ],
  }))

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: overlayOpacity.value > 0 ? "auto" : "none",
  }))

  const hamburgerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(hamburgerRotation.value, [0, 1], [0, 45])}deg`,
      },
    ],
  }))

  const dropdownAnimatedStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(dropdownAnimation.value, [0, 1], [0, 300]),
    opacity: dropdownAnimation.value,
  }))

  if (!isShown) return null

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={styles.container}>
        {/* Main Header */}
        <View style={styles.header}>
          {/* Hamburger Menu Button */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Animated.View style={hamburgerAnimatedStyle}>
              <Icon name={isMenuOpen ? "close" : "menu"} size={moderateScale(24)} color="#374151" />
            </Animated.View>
          </TouchableOpacity>

          {/* Logo and Brand Section */}
          <View style={styles.logoSection}>
            <FastImage
              source={require("../../assets/images/logo.webp")}
              style={styles.logo}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.brandInfo}>
              <Text style={styles.brandName}>Dr. Rajneesh Kant</Text>
              <Text style={styles.brandTagline}> Chiropractic Care</Text>
            </View>
          </View>

          {/* Book Now Button */}
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <Icon name="event" size={moderateScale(16)} color="#ffffff" />
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Mobile Menu Overlay */}
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={toggleMenu} />
      </Animated.View>

      {/* Mobile Menu */}
      <Animated.View style={[styles.mobileMenu, menuAnimatedStyle]}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.mobileMenuScroll}>
          {/* User Section */}
          {isAuthenticated && user && (
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                {user?.data?.profileImage?.url ? (
                  <Image source={{ uri: user?.data?.profileImage?.url }} style={styles.userImage} resizeMode="cover" />
                ) : (
                  <Icon name="person" size={moderateScale(24)} color="#6366f1" />
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.data?.name}</Text>
                <Text style={styles.userEmail}>{user?.data?.email}</Text>
              </View>
            </View>
          )}

          {/* Navigation Items */}
          {navigationItems.map((item) => (
            <View key={item.label}>
              <TouchableOpacity
                style={styles.mobileNavItem}
                onPress={() => (item.submenu ? toggleDropdown(item.label) : handleNavigation(item.href))}
              >
                <Icon name={item.icon} size={moderateScale(20)} color="#374151" />
                <Text style={styles.mobileNavText}>{item.label}</Text>
                {item.submenu && (
                  <Icon
                    name={activeDropdown === item.label ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={moderateScale(18)}
                    color="#9ca3af"
                  />
                )}
              </TouchableOpacity>

              {/* Mobile Submenu with ScrollView */}
              {item.submenu && activeDropdown === item.label && (
                <Animated.View style={[styles.mobileSubmenu, dropdownAnimatedStyle]}>
                  <ScrollView
                    style={styles.submenuScrollView}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    {item.submenu.map((subItem, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.mobileSubmenuItem}
                        onPress={() =>
                          handleNavigation(subItem.href || `/treatments/${subItem.service_name?.toLowerCase()}`)
                        }
                      >
                        <Icon name="chevron-right" size={moderateScale(16)} color="#9ca3af" />
                        <Text style={styles.mobileSubmenuText}>{subItem.service_name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              )}
            </View>
          ))}

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity style={styles.quickActionItem} onPress={handleBookNow}>
              <Icon name="event" size={moderateScale(18)} color="#6366f1" />
              <Text style={styles.quickActionText}>Book Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionItem} onPress={() => handleNavigation("/emergency")}>
              <Icon name="local-hospital" size={moderateScale(18)} color="#ef4444" />
              <Text style={styles.quickActionText}>Emergency Contact</Text>
            </TouchableOpacity>
          </View>

          {/* Social Media Section */}
          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Follow Us</Text>
            <View style={styles.socialIcons}>
              {socialLinks.map((social) => (
                <TouchableOpacity
                  key={social.name}
                  style={[styles.socialIcon, { backgroundColor: social.color }]}
                  onPress={() => handleSocialPress(social.url)}
                >
                  <Icon name={social.icon} size={moderateScale(18)} color="#ffffff" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.menuFooter}>
            <Text style={styles.footerText}>© 2024 Dr. Rajneesh Kant</Text>
            <Text style={styles.footerSubtext}>Professional Healthcare Services</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    minHeight: verticalScale(60),
  },
  menuButton: {
    padding: scale(8),
    borderRadius: scale(8),
    backgroundColor: "#f9fafb",
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginHorizontal: scale(16),
  },
  logo: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(17.5),
    marginRight: scale(10),
  },
  brandInfo: {
    alignItems: "center",
  },
  brandName: {
    fontSize: moderateScale(16),
    fontWeight: "700",
    color: "#1f2937",
  },
  brandTagline: {
    fontSize: moderateScale(11),
    color: "#6b7280",
    fontWeight: "500",
  },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: moderateScale(12),
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: scale(4),
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 998,
  },
  overlayTouchable: {
    flex: 1,
  },
  mobileMenu: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: scale(300),
    backgroundColor: "#ffffff",
    zIndex: 999,
    shadowColor: "#000000",
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 16,
  },
  mobileMenuScroll: {
    flex: 1,
    paddingTop: verticalScale(60),
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#f9fafb",
  },
  userAvatar: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
    overflow: "hidden",
  },
  userImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#1f2937",
  },
  userEmail: {
    fontSize: moderateScale(12),
    color: "#6b7280",
  },
  mobileNavItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  mobileNavText: {
    fontSize: moderateScale(16),
    color: "#374151",
    fontWeight: "500",
    marginLeft: scale(12),
    flex: 1,
  },
  mobileSubmenu: {
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  },
  submenuScrollView: {
    maxHeight: verticalScale(500),
  },
  mobileSubmenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(40),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  mobileSubmenuText: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    marginLeft: scale(8),
  },
  quickActionsSection: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#374151",
    marginBottom: verticalScale(12),
  },
  quickActionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    backgroundColor: "#f9fafb",
    borderRadius: scale(8),
    marginBottom: verticalScale(8),
  },
  quickActionText: {
    fontSize: moderateScale(14),
    color: "#374151",
    fontWeight: "500",
    marginLeft: scale(12),
  },
  socialSection: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  socialTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#374151",
    marginBottom: verticalScale(12),
  },
  socialIcons: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  socialIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
    marginBottom: verticalScale(8),
  },
  menuFooter: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(20),
    alignItems: "center",
  },
  footerText: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    fontWeight: "500",
  },
  footerSubtext: {
    fontSize: moderateScale(10),
    color: "#9ca3af",
    marginTop: verticalScale(4),
  },
})
