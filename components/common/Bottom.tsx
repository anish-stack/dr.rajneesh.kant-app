"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { scale, verticalScale, moderateScale } from "react-native-size-matters"
import Icon from "react-native-vector-icons/MaterialIcons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../context/AuthContext"

const { width } = Dimensions.get("window")

interface TabItem {
  id: string
  label: string
  icon: string
  route: string
  authRequired?: boolean
}

const baseTabs: TabItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "home",
    route: "Home",
  },
  {
    id: "treatments",
    label: "Treatments",
    icon: "medical-services",
    route: "Treatments",
  },
  {
    id: "book",
    label: "Book Now",
    icon: "event",
    route: "booking-now",
  },
]

export default function BottomTabs({ activeTab }: { navigation?: any; activeTab?: string }) {
  const [currentTab, setCurrentTab] = useState(activeTab || "home")
  const indicatorPosition = useSharedValue(0)
  const navigation = useNavigation()
  const { isAuthenticated } = useAuth()

  // Dynamic tabs based on authentication
  const tabs = [
    ...baseTabs,
    {
      id: isAuthenticated ? "profile" : "login",
      label: isAuthenticated ? "Profile" : "Login",
      icon: isAuthenticated ? "person" : "login",
      route: isAuthenticated ? "Profile" : "Login",
      authRequired: !isAuthenticated,
    },
  ]

  const tabAnimations = tabs.map(() => useSharedValue(0))

  // Update current tab when activeTab prop changes
  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab)
      const tabIndex = tabs.findIndex(tab => tab.id === activeTab)
      if (tabIndex !== -1) {
        indicatorPosition.value = withSpring(tabIndex, {
          damping: 15,
          stiffness: 150,
        })
      }
    }
  }, [activeTab, tabs])

  // Initialize indicator position
  useEffect(() => {
    const initialIndex = tabs.findIndex(tab => tab.id === currentTab)
    if (initialIndex !== -1) {
      indicatorPosition.value = initialIndex
    }
  }, [tabs])

  const handleTabPress = (tab: TabItem, index: number) => {
    setCurrentTab(tab.id)

    // Animate indicator
    indicatorPosition.value = withSpring(index, {
      damping: 15,
      stiffness: 150,
    })

    // Animate tab
    tabAnimations[index].value = withSpring(1, {
      damping: 10,
      stiffness: 200,
    })

    // Reset other tabs
    tabAnimations.forEach((anim, i) => {
      if (i !== index) {
        anim.value = withTiming(0, { duration: 200 })
      }
    })

    // Handle navigation
    if (navigation) {
      navigation.navigate(tab.route)
    }

    console.log(`Navigate to: ${tab.route}`)
  }

  // Animated styles
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const tabWidth = width / tabs.length
    return {
      transform: [
        {
          translateX: interpolate(
            indicatorPosition.value,
            [0, tabs.length - 1],
            [0, tabWidth * (tabs.length - 1)]
          ),
        },
      ],
    }
  })

  const getTabAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const isActive = currentTab === tabs[index].id
      const scale = interpolate(tabAnimations[index].value, [0, 1], [1, 1.1])

      return {
        transform: [{ scale: isActive ? scale : 1 }],
      }
    })
  }

  return (
    <View style={styles.container}>

      {tabs.map((tab, index) => {
        const isActive = currentTab === tab.id
        const isBookNow = tab.id === "book"
        const isLogin = tab.id === "login"

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              isBookNow && styles.bookNowTab,
              isLogin && styles.loginTab,
            ]}
            onPress={() => handleTabPress(tab, index)}
            activeOpacity={0.7}
          >
            <Animated.View style={[styles.tabContent, getTabAnimatedStyle(index)]}>
              {/* Special styling for Book Now button */}
              {isBookNow ? (
                <View style={styles.bookNowContainer}>
                  <View style={styles.bookNowIconContainer}>
                    <Icon name={tab.icon} size={moderateScale(24)} color="#ffffff" />
                  </View>
                  <Text style={styles.bookNowText}>{tab.label}</Text>
                </View>
              ) : isLogin ? (
                /* Special styling for Login tab */
                <View style={styles.loginContainer}>
                  <View style={[styles.iconContainer, isActive && styles.activeIconContainer, styles.loginIconContainer]}>
                    <Icon name={tab.icon} size={moderateScale(22)} color={isActive ? "#ffffff" : "#9ca3af"} />
                    {isActive && <View style={styles.activeDot} />}
                  </View>
                  <Text style={[styles.tabLabel, isActive && styles.activeLoginLabel]}>{tab.label}</Text>
                </View>
              ) : (
                /* Regular tabs */
                <>
                  <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                    <Icon name={tab.icon} size={moderateScale(22)} color={isActive ? "#2563eb" : "#9ca3af"} />

                  </View>
                  <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
                </>
              )}
            </Animated.View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(4),
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    position: "relative",
    minHeight: verticalScale(70),
  },
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    height: verticalScale(3),
    backgroundColor: "#2563eb",
    borderRadius: scale(2),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(2),
    minHeight: verticalScale(60),
  },
  bookNowTab: {
    marginTop: verticalScale(-10),
  },
  loginTab: {
    marginTop: verticalScale(-5),
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: verticalScale(50),
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(4),
    position: "relative",
    minWidth: scale(32),
    minHeight: verticalScale(32),
  },
  activeIconContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: scale(12),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
  },
  activeDot: {
    position: "absolute",
    top: verticalScale(-2),
    right: scale(-2),
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: "#ef4444",
  },
  tabLabel: {
    fontSize: moderateScale(10),
    color: "#9ca3af",
    fontWeight: "500",
    textAlign: "center",
    marginTop: verticalScale(2),
  },
  activeTabLabel: {
    color: "#2563eb",
    fontWeight: "600",
  },
  // Book Now styles
  bookNowContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  bookNowIconContainer: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(4),
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookNowText: {
    fontSize: moderateScale(9),
    color: "#2563eb",
    fontWeight: "600",
    textAlign: "center",
  },
  // Login tab styles
  loginContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loginIconContainer: {
    backgroundColor: "#10b981",
    borderRadius: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    minWidth: scale(36),
    minHeight: verticalScale(36),
  },
  activeLoginLabel: {
    color: "#10b981",
    fontWeight: "600",
  },
})