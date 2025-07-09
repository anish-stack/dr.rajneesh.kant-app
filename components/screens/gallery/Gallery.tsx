"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  Animated,
  StatusBar,
} from "react-native"
import { scale, verticalScale, moderateScale } from "react-native-size-matters"
import Icon from "react-native-vector-icons/MaterialIcons"
import Video from "react-native-video"
import LinearGradient from "react-native-linear-gradient"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const Gallery = ({ navigation }) => {
  const [hoveredReel, setHoveredReel] = useState(null)
  const [playingVideos, setPlayingVideos] = useState({})
  const [mutedVideos, setMutedVideos] = useState({})
  const [videoDurations, setVideoDurations] = useState({})
  const [videoProgress, setVideoProgress] = useState({})
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  const videoRefs = useRef({})
  const flatListRef = useRef(null)

  const reels = [
    {
      id: 1,
      title: "Cervical Pain Chiropractic Treatment",
      description: "Advanced cervical spine adjustment for instant pain relief",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Replace with your video URL
      views: "125K",
      likes: "8.2K",
      category: "Cervical Treatment",
      duration: "0:45",
      gradientColors: ["#fb923c", "#ef4444"],
      featured: true,
    },
    {
      id: 2,
      title: "Nose Alignment Treatment",
      description: "Precision nasal alignment technique for better breathing",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", // Replace with your video URL
      views: "89K",
      likes: "5.1K",
      category: "Specialized Care",
      duration: "0:38",
      gradientColors: ["#60a5fa", "#a855f7"],
    },
    {
      id: 3,
      title: "Celebrity Treatment - Lalu Yadav",
      description: "Therapeutic massage treatment for political leader",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4", // Replace with your video URL
      views: "234K",
      likes: "18.7K",
      category: "Celebrity Care",
      duration: "0:52",
      gradientColors: ["#a855f7", "#ec4899"],
      celebrity: true,
    },
    {
      id: 4,
      title: "Manoj Tiwari Treatment",
      description: "Bollywood actor receives expert chiropractic care",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Replace with your video URL
      views: "187K",
      likes: "14.2K",
      category: "Celebrity Care",
      duration: "0:48",
      gradientColors: ["#facc15", "#fb923c"],
      celebrity: true,
    },
    {
      id: 5,
      title: "Pawan Singh Power Treatment",
      description: "Bhojpuri superstar's chiropractic treatment session",
      videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4", // Replace with your video URL
      views: "366K",
      likes: "11.6K",
      category: "Celebrity Care",
      duration: "0:55",
      gradientColors: ["#ec4899", "#ef4444"],
      celebrity: true,
      mostViewed: true,
    },
  ]

  // Animation effect
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleVideoPlay = (reelId) => {
    // Pause all other videos first
    Object.keys(playingVideos).forEach((id) => {
      if (id !== reelId.toString() && playingVideos[id]) {
        setPlayingVideos((prev) => ({ ...prev, [id]: false }))
      }
    })

    // Toggle current video
    setPlayingVideos((prev) => ({ ...prev, [reelId]: !prev[reelId] }))
  }

  const handleVideoEnd = (reelId) => {
    setPlayingVideos((prev) => ({ ...prev, [reelId]: false }))
    setVideoProgress((prev) => ({ ...prev, [reelId]: 0 }))
  }

  const handleVideoProgress = (data, reelId) => {
    const progress = (data.currentTime / data.seekableDuration) * 100
    setVideoProgress((prev) => ({ ...prev, [reelId]: progress || 0 }))
  }

  const handleVideoLoad = (data, reelId) => {
    const duration = data.duration
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    setVideoDurations((prev) => ({
      ...prev,
      [reelId]: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    }))
  }

  const toggleMute = (reelId) => {
    setMutedVideos((prev) => ({ ...prev, [reelId]: !prev[reelId] }))
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const featuredReel = reels.find((r) => r.mostViewed) || reels[0]

  const renderReelCard = ({ item: reel, index }) => (
    <View style={styles.reelCard}>
      <LinearGradient
        colors={[...reel.gradientColors, "transparent"]}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.videoContainer}>
        <Video
          ref={(ref) => (videoRefs.current[reel.id] = ref)}
          source={{ uri: reel.videoSrc }}
          style={styles.video}
          resizeMode="cover"
          paused={!playingVideos[reel.id]}
          muted={mutedVideos[reel.id]}
          repeat={false}
          onLoad={(data) => handleVideoLoad(data, reel.id)}
          onProgress={(data) => handleVideoProgress(data, reel.id)}
          onEnd={() => handleVideoEnd(reel.id)}
          poster="https://via.placeholder.com/300x400/cccccc/666666?text=Loading..."
        />

        {/* Video Overlay */}
        <View style={styles.videoOverlay}>
          {/* Play Button */}
          {!playingVideos[reel.id] && (
            <TouchableOpacity style={styles.playButton} onPress={() => handleVideoPlay(reel.id)}>
              <LinearGradient colors={reel.gradientColors} style={styles.playButtonGradient}>
                <Icon name="play-arrow" size={moderateScale(32)} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Top Badges */}
          <View style={styles.topBadges}>
            {reel.featured && (
              <LinearGradient colors={["#facc15", "#fb923c"]} style={styles.badge}>
                <Icon name="star" size={moderateScale(12)} color="#ffffff" />
                <Text style={styles.badgeText}>Featured</Text>
              </LinearGradient>
            )}
            {reel.celebrity && (
              <LinearGradient colors={["#a855f7", "#ec4899"]} style={styles.badge}>
                <Icon name="emoji-events" size={moderateScale(12)} color="#ffffff" />
                <Text style={styles.badgeText}>Celebrity</Text>
              </LinearGradient>
            )}
          </View>

          {/* Controls */}
          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => toggleMute(reel.id)}>
              <Icon
                name={mutedVideos[reel.id] ? "volume-off" : "volume-up"}
                size={moderateScale(16)}
                color="#ffffff"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Icon name="more-vert" size={moderateScale(16)} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={reel.gradientColors}
                style={[styles.progressFill, { width: `${videoProgress[reel.id] || 0}%` }]}
              />
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.durationText}>{videoDurations[reel.id] || "0:00"}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{reel.category}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {reel.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {reel.description}
        </Text>
        <View style={styles.cardStats}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="visibility" size={moderateScale(14)} color="#60a5fa" />
              <Text style={styles.statText}>{reel.views}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="favorite" size={moderateScale(14)} color="#ef4444" />
              <Text style={styles.statText}>{reel.likes}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.playSmallButton}
            onPress={() => handleVideoPlay(reel.id)}
          >
            <LinearGradient colors={reel.gradientColors} style={styles.playSmallButtonGradient}>
              <Icon
                name={playingVideos[reel.id] ? "pause" : "play-arrow"}
                size={moderateScale(16)}
                color="#ffffff"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      {/* Background Gradients */}
      <View style={styles.backgroundGradients}>
        <LinearGradient
          colors={["#ddd6fe", "#fce7f3"]}
          style={[styles.bgGradient, styles.bgGradient1]}
        />
        <LinearGradient
          colors={["#fed7d7", "#fbb6ce"]}
          style={[styles.bgGradient, styles.bgGradient2]}
        />
        <LinearGradient
          colors={["#bfdbfe", "#c7d2fe"]}
          style={[styles.bgGradient, styles.bgGradient3]}
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient colors={["#a855f7", "#ec4899"]} style={styles.headerBadge}>
            <Icon name="play-circle-filled" size={moderateScale(16)} color="#ffffff" />
            <Text style={styles.headerBadgeText}>Featured Treatment Reels</Text>
            <Icon name="auto-awesome" size={moderateScale(16)} color="#ffffff" />
          </LinearGradient>

          <Text style={styles.mainTitle}>
            Watch{" "}
            <Text style={styles.gradientText}>Healing</Text>
          </Text>

          <Text style={styles.subtitle}>
            Experience the future of healthcare through our exclusive treatment reels. Real patients, real results, real
            transformation.
          </Text>
        </View>

        {/* Featured Reel */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredCard}>
            <View style={styles.featuredVideoContainer}>
              <Video
                source={{ uri: featuredReel.videoSrc }}
                style={styles.featuredVideo}
                resizeMode="cover"
                paused={!playingVideos[featuredReel.id]}
                muted={mutedVideos[featuredReel.id]}
                repeat={false}
                onLoad={(data) => handleVideoLoad(data, featuredReel.id)}
                onProgress={(data) => handleVideoProgress(data, featuredReel.id)}
                onEnd={() => handleVideoEnd(featuredReel.id)}
                poster="https://via.placeholder.com/400x300/cccccc/666666?text=Featured+Video"
              />
              
              {!playingVideos[featuredReel.id] && (
                <TouchableOpacity
                  style={styles.featuredPlayButton}
                  onPress={() => handleVideoPlay(featuredReel.id)}
                >
                  <LinearGradient colors={featuredReel.gradientColors} style={styles.featuredPlayGradient}>
                    <Icon name="play-arrow" size={moderateScale(40)} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.featuredContent}>
              <LinearGradient colors={["#a855f7", "#ec4899"]} style={styles.trendingBadge}>
                <Text style={styles.trendingText}>🔥 Trending Now</Text>
              </LinearGradient>

              <Text style={styles.featuredTitle}>{featuredReel.title}</Text>
              <Text style={styles.featuredDescription}>{featuredReel.description}</Text>

              <View style={styles.featuredStats}>
                <View style={styles.featuredStatItem}>
                  <Icon name="visibility" size={moderateScale(20)} color="#60a5fa" />
                  <Text style={styles.featuredStatText}>{featuredReel.views}</Text>
                </View>
                <View style={styles.featuredStatItem}>
                  <Icon name="favorite" size={moderateScale(20)} color="#ef4444" />
                  <Text style={styles.featuredStatText}>{featuredReel.likes}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.watchNowButton}
                onPress={() => handleVideoPlay(featuredReel.id)}
              >
                <LinearGradient colors={["#a855f7", "#ec4899"]} style={styles.watchNowGradient}>
                  <Icon
                    name={playingVideos[featuredReel.id] ? "pause" : "play-arrow"}
                    size={moderateScale(20)}
                    color="#ffffff"
                  />
                  <Text style={styles.watchNowText}>
                    {playingVideos[featuredReel.id] ? "Pause" : "Watch"} Now
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* All Reels Section */}
        <View style={styles.allReelsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Treatment Reels</Text>
            <TouchableOpacity style={styles.scrollButton}>
              <Icon name="arrow-forward" size={moderateScale(20)} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={reels.filter((reel) => !reel.mostViewed)}
            renderItem={renderReelCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reelsList}
            ItemSeparatorComponent={() => <View style={{ width: scale(16) }} />}
          />
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>
              Ready for Your{" "}
              <Text style={styles.ctaGradientText}>Transformation?</Text>
            </Text>
            <Text style={styles.ctaDescription}>
              Join thousands who've experienced life-changing results. Book your consultation today and become our next
              success story featured in our reels.
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity
                style={styles.primaryCtaButton}
                onPress={() => navigation?.navigate("BookingScreen")}
              >
                <LinearGradient colors={["#a855f7", "#ec4899"]} style={styles.primaryCtaGradient}>
                  <Icon name="people" size={moderateScale(20)} color="#ffffff" />
                  <Text style={styles.primaryCtaText}>Book Your Session</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryCtaButton}>
                <Icon name="play-circle-outline" size={moderateScale(20)} color="#6b7280" />
                <Text style={styles.secondaryCtaText}>Watch More Reels</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  backgroundGradients: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgGradient: {
    position: "absolute",
    width: scale(200),
    height: scale(200),
    borderRadius: scale(100),
    opacity: 0.3,
  },
  bgGradient1: {
    top: -scale(80),
    right: -scale(80),
  },
  bgGradient2: {
    bottom: -scale(80),
    left: -scale(80),
  },
  bgGradient3: {
    top: "50%",
    left: "50%",
    marginTop: -scale(100),
    marginLeft: -scale(100),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  header: {
    alignItems: "center",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(32),
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(25),
    marginBottom: verticalScale(20),
    gap: scale(8),
  },
  headerBadgeText: {
    color: "#ffffff",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  mainTitle: {
    fontSize: moderateScale(36),
    fontWeight: "900",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: verticalScale(16),
  },
  gradientText: {
    color: "#a855f7",
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: "#6b7280",
    textAlign: "center",
    lineHeight: moderateScale(24),
    paddingHorizontal: scale(20),
  },
  featuredSection: {
    marginBottom: verticalScale(32),
  },
  featuredCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: scale(24),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredVideoContainer: {
    height: verticalScale(200),
    position: "relative",
  },
  featuredVideo: {
    width: "100%",
    height: "100%",
  },
  featuredPlayButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -scale(30),
    marginLeft: -scale(30),
  },
  featuredPlayGradient: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    alignItems: "center",
    justifyContent: "center",
  },
  featuredContent: {
    padding: scale(20),
  },
  trendingBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(12),
    marginBottom: verticalScale(12),
  },
  trendingText: {
    color: "#ffffff",
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  featuredTitle: {
    fontSize: moderateScale(20),
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: verticalScale(8),
  },
  featuredDescription: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(16),
  },
  featuredStats: {
    flexDirection: "row",
    gap: scale(24),
    marginBottom: verticalScale(20),
  },
  featuredStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  featuredStatText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#6b7280",
  },
  watchNowButton: {
    borderRadius: scale(12),
    overflow: "hidden",
  },
  watchNowGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    gap: scale(8),
  },
  watchNowText: {
    color: "#ffffff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  allReelsSection: {
    marginBottom: verticalScale(32),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(24),
    fontWeight: "700",
    color: "#1f2937",
  },
  scrollButton: {
    padding: scale(8),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  reelsList: {
    paddingVertical: verticalScale(8),
  },
  reelCard: {
    width: scale(280),
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: scale(16),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  videoContainer: {
    height: verticalScale(350),
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -scale(25),
    marginLeft: -scale(25),
  },
  playButtonGradient: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    alignItems: "center",
    justifyContent: "center",
  },
  topBadges: {
    position: "absolute",
    top: scale(12),
    left: scale(12),
    gap: verticalScale(8),
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    gap: scale(4),
  },
  badgeText: {
    color: "#ffffff",
    fontSize: moderateScale(10),
    fontWeight: "600",
  },
  videoControls: {
    position: "absolute",
    top: scale(12),
    right: scale(12),
    flexDirection: "row",
    gap: scale(8),
  },
  controlButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: scale(8),
    borderRadius: scale(20),
  },
  progressContainer: {
    position: "absolute",
    bottom: scale(12),
    left: scale(12),
    right: scale(12),
  },
  progressBar: {
    height: verticalScale(3),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: scale(2),
    marginBottom: verticalScale(8),
  },
  progressFill: {
    height: "100%",
    borderRadius: scale(2),
  },
  videoInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  durationText: {
    color: "#ffffff",
    fontSize: moderateScale(10),
    fontWeight: "600",
  },
  categoryBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: scale(8),
  },
  categoryText: {
    color: "#ffffff",
    fontSize: moderateScale(10),
    fontWeight: "600",
  },
  cardContent: {
    padding: scale(16),
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: verticalScale(8),
  },
  cardDescription: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    lineHeight: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: scale(16),
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  statText: {
    fontSize: moderateScale(12),
    color: "#6b7280",
    fontWeight: "500",
  },
  playSmallButton: {
    borderRadius: scale(8),
    overflow: "hidden",
  },
  playSmallButtonGradient: {
    padding: scale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  ctaSection: {
    marginBottom: verticalScale(32),
  },
  ctaCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: scale(24),
    padding: scale(24),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaTitle: {
    fontSize: moderateScale(24),
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
  ctaGradientText: {
    color: "#a855f7",
  },
  ctaDescription: {
    fontSize: moderateScale(14),
    color: "#6b7280",
    textAlign: "center",
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(24),
  },
  ctaButtons: {
    width: "100%",
    gap: verticalScale(12),
  },
  primaryCtaButton: {
    borderRadius: scale(12),
    overflow: "hidden",
  },
  primaryCtaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    gap: scale(8),
  },
  primaryCtaText: {
    color: "#ffffff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  secondaryCtaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: scale(12),
    gap: scale(8),
  },
  secondaryCtaText: {
    color: "#6b7280",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
})

export default Gallery
