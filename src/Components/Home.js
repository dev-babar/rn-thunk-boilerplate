import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import images from "../assets";

import BottomNavigation from "./Explore/BottomNavigation";
import { styles } from "../Stylesheets/StylesHome";
import { connect } from "react-redux";
import {
  request,
  generalSaveAction,
  multipleRequest,
} from "../Store/Action/ServiceAction";
import { getPostRequest } from "../Store/Action/PostAction";

import _ from "lodash";
import constant from "../HttpServiceManager/constant";
import {
  POSTS,
  NEW_REVIEW,
  WATCHLIST,
  POST_DETAIL,
  COMMENTS,
  GENERAL_POST,
  UPDATE_POST,
} from "../Store/Types";
import { AlertHelper } from "../utility/utility";
import { FlatListHandler, PostCard, RoundImage } from "../reuseableComponents";
import { AppStyles, Colors, Metrics } from "../theme";
import moment from "moment";
import Share from "react-native-share";
import { globalStyles } from "../Stylesheets/GlobalStyles";

class Home extends Component {
  state = {
    sharedPostTitle: "",
    postID: 0,
    isMyPost: false,
  };

  componentDidMount = () => {
    this.fetchPostRequest(0, false, true);
  };

  fetchPostRequest = (offset = 0, concat = false, showLoader = false) => {
    const { getPostRequest } = this.props;
    let params = { limit: 10, offset };
    getPostRequest(
      constant.posts,
      "get",
      params,
      POSTS,
      showLoader,
      undefined,
      undefined,
      concat
    );
  };

  // Post Like Handler
  likeDislikeHandler = (postID) => (count) => {
    const { generalSaveAction, request, generalPosts } = this.props;
    let selectedPost = generalPosts[postID];
    let updatedPost = {
      ...selectedPost,
      likedByMe: !selectedPost.likedByMe,
      likeCount: count,
    };
    generalSaveAction(UPDATE_POST, updatedPost);
    request(constant.likePost + postID, "post", null, undefined, false);
  };

  commentHandler = (postID) => () => {
    const { generalSaveAction, request, navigation } = this.props;
    request(
      constant.comments + postID,
      "get",
      { limit: 10, offset: 0 },
      COMMENTS,
      true,
      undefined,
      undefined,
      false,
      true
      // () => navigation.navigate("Comments")
    );

    navigation.navigate("Comments", { postID });
  };

  // Post add or remover from Watchlish
  addOrRemoveToWatchList = (postID) => () => {
    const { request } = this.props;
    request(
      constant.subscribePost + postID,
      "post",
      null,
      undefined,
      true,
      this.onWatchListRequestSuccess(postID)
    );
  };

  onWatchListRequestSuccess = (postID) => (responseOnSuccess) => {
    const { generalSaveAction, watchList } = this.props;
    let updatedWatchList = watchList.includes(postID)
      ? watchList.filter((id) => id != postID)
      : [postID, ...watchList];

    generalSaveAction(UPDATE_POST, responseOnSuccess.post);
    generalSaveAction(WATCHLIST.SUCCESS, updatedWatchList);
  };

  //   Internal Share Handler
  sharePostHandler = (postID) => () => {
    this.setState({ sharedPostTitle: "", postID }, () =>
      this.RBSheetForSharePost.open()
    );
  };

  //   Internal Share Handler
  internalPostShare = () => {
    const { request, generalSaveAction } = this.props;
    const { postID, sharedPostTitle } = this.state;
    this.RBSheetForSharePost.close();
    request(
      constant.sharePost + postID,
      "post",
      { text: sharedPostTitle },
      undefined,
      true,
      this.onInternalPostShareSuccess
    );
  };

  onInternalPostShareSuccess = (responseOnSuccess) => {
    const { generalSaveAction, generalPosts, posts } = this.props;
    const { postID } = this.state;
    let { sharedPostFlag, sharedPost } = generalPosts[postID];
    let isSharePostAvailable = !_.isUndefined(sharedPostFlag) && sharedPostFlag;
    let postData = isSharePostAvailable ? sharedPost : generalPosts[postID];
    let updatedPost = {
      ...postData,
      shareCount: (postData["shareCount"] += 1),
    };
    if (isSharePostAvailable) {
      updatedPost = {
        ...generalPosts[postID],
        sharedPost: updatedPost,
      };
    }

    generalSaveAction(UPDATE_POST, responseOnSuccess);
    generalSaveAction(POSTS.SUCCESS, [responseOnSuccess.id, ...posts]);
    AlertHelper.show("success", "", "Post has been shared succesfully !");
  };

  //  External Share Handler
  externalPostShare = async () => {
    const { generalPosts } = this.props;
    const { postID, sharedPostTitle } = this.state;
    let { sharedPostFlag, sharedPost } = generalPosts[postID];
    let isSharePostAvailable = !_.isUndefined(sharedPostFlag) && sharedPostFlag;
    let postURL = isSharePostAvailable
      ? sharedPost["link"]
      : generalPosts[postID]["link"];
    try {
      this.RBSheetForSharePost.close();
      let result = await Share.open({
        message: _.isEmpty(sharedPostTitle)
          ? "“Check out my movie/series review on Viewed and follow me for more!”"
          : sharedPostTitle,
        title: "Viewed",
        url: postURL ?? "Oops, Something went wrong.!",
      });
    } catch (error) {
      error && global.log("error on external post share", error);
    }
  };

  postDetailHandler = (postID) => () => {
    const { generalPosts, request, generalSaveAction, navigation } = this.props;
    let id = generalPosts[postID].sharedPost.id ?? 0;
    request(
      constant.postDetail + id,
      "get",
      null,
      POST_DETAIL,
      true,
      () => navigation.navigate("PostDetails", { postID }),
      undefined,
      false,
      true
    );
    // navigation.navigate("PostDetails", { postID });
  };

  OtherProfileHandler = (createdBy) => () => {
    const { navigation, user } = this.props;
    let routeName = user.id == createdBy.id ? "MyProfile" : "OtherUser";
    navigation.navigate(routeName, { otherUser: createdBy });
  };

  updateTitleText = (text) => {
    this.setState({ sharedPostTitle: text });
  };

  // ===============================================

  handlerPostDisplayStatus = (postID) => () => {
    const { generalPosts } = this.props;
    let post = generalPosts[postID];
    this.setState({ postID, isMyPost: post["myPost"] }, () =>
      this.RBSheetForPostDisplayStatus.open()
    );
  };

  deletePostHandler = () => {
    const { request, generalPosts, generalSaveAction, posts } = this.props;
    const { postID } = this.state;
    this.RBSheetForPostDisplayStatus.close();
    request(
      constant.postDelete + postID,
      "delete",
      null,
      undefined,
      true,
      () => {
        let updateGeneralPostList = { ...generalPosts };
        delete updateGeneralPostList[postID];
        let updatedPost = posts.filter((ids) => ids != postID);
        generalSaveAction(GENERAL_POST.SUCCESS, updateGeneralPostList);
        generalSaveAction(POSTS.SUCCESS, updatedPost);
        AlertHelper.show("success", "", "Post Deleted");
      }
    );
  };

  hidePostHander = () => {
    const { request, generalPosts, generalSaveAction, posts } = this.props;
    const { postID } = this.state;
    this.RBSheetForPostDisplayStatus.close();
    request(
      constant.hidePost + postID,
      "patch",
      null,
      undefined,
      true,
      (response) => {
        global.log("post", response.post);
        generalSaveAction(UPDATE_POST, response.post);
        // AlertHelper.show("success", "", "Post Deleted");
      }
    );
  };

  reportPostHander = () => {
    const { request, generalPosts, generalSaveAction, posts } = this.props;
    const { postID } = this.state;
    this.RBSheetForPostDisplayStatus.close();
    request(
      constant.reportPost + postID,
      "patch",
      null,
      undefined,
      true,
      (response) => {
        AlertHelper.show("success", "", "Post has been reported");
      }
    );
  };

  rednerMovieBox = ({ item, index }) => {
    const { generalPosts } = this.props;
    let post = generalPosts[item];
    if (_.isUndefined(post)) return;
    try {
      return (
        <PostCard
          data={post}
          cbOnLike={this.likeDislikeHandler(item)}
          cbOnComment={this.commentHandler(item)}
          cbOnWatchlist={this.addOrRemoveToWatchList(item)}
          cbOnSharePost={this.sharePostHandler(item)}
          cbForUserProfileSearch={this.OtherProfileHandler}
          cbForPostDetail={this.postDetailHandler(item)}
          cbForPostDisplayStatus={this.handlerPostDisplayStatus(item)}
        />
      );
    } catch (error) {
      global.log("error", error);
      return (
        <View style={globalStyles.postNotFound}>
          <Text>Oops, Something went wrong !</Text>
        </View>
      );
    }
  };

  render() {
    const { posts, generalPosts, user } = this.props;
    const { sharedPostTitle, isMyPost } = this.state;
    // let { name, avatar } = user;
    let name = user?.name;
    let avatar = user?.name;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor="#0C1A1E"
        />
        <View style={{ width: "100%", height: "100%" }}>
          <ImageBackground
            style={styles.imageStyle}
            imageStyle={{
              borderColor: "transparent",
              resizeMode: "stretch",
            }}
            source={require("../assets/bg.png")}
          >
            {/* main screen */}
            <View style={styles.halfScreen}>
              {/* header */}
              <View style={styles.backArrow}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.openDrawer();
                  }}
                >
                  <Image
                    style={styles.sideBar}
                    source={require("../assets/filter.png")}
                  ></Image>
                </TouchableOpacity>
                <Image
                  style={styles.Viewed}
                  source={require("../assets/header.png")}
                ></Image>
                <View style={styles.notificationView}>
                  <Text style={styles.Number}>3</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Notifications");
                  }}
                >
                  <Image
                    style={styles.bellIcon}
                    source={require("../assets/bellicon.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
              {/* write a review */}
              <View style={styles.writeReview}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    const { generalSaveAction, navigation } = this.props;
                    generalSaveAction(NEW_REVIEW);
                    navigation.navigate("WriteReview");
                  }}
                  style={styles.writeTouch}
                >
                  <View style={styles.writeView}>
                    <Image
                      style={styles.writeIcon}
                      source={require("../assets/write.png")}
                    ></Image>
                    <Text style={styles.write}>Write a Review</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {/* Posts */}

              <FlatListHandler
                showsVerticalScrollIndicator={false}
                data={posts}
                extraData={generalPosts}
                renderItem={this.rednerMovieBox}
                contentContainerStyle={{
                  paddingBottom: Metrics.doubleBaseMargin,
                }}
                fetchRequest={(onEndReached, length, showLoader) => {
                  this.fetchPostRequest(length, onEndReached, showLoader);
                }}
                // isFetching={"abc"}
              />
              <BottomNavigation navigation={this.props.navigation} />
            </View>
            {/*end */}

            <>
              <RBSheet
                ref={(ref) => {
                  this.RBSheetForSharePost = ref;
                }}
                // closeOnDragDown={true}
                height={250}
                openDuration={250}
                customStyles={{
                  wrapper: {
                    backgroundColor: "rgba(52, 52, 52, 0.8)",
                  },
                  draggableIcon: {
                    // backgroundColor: "#000",
                    backgroundColor: "transparent",
                  },
                  container: {
                    borderTop: 0.5,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: "#F7F7F7",
                  },
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={styles.item}>
                      <RoundImage
                        source={avatar ? { uri: avatar } : undefined}
                        imgStyle={globalStyles.RBAvatar}
                      />
                      <Text style={styles.title}>{name}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.RBSheetForSharePost.close()}
                    >
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          resizeMode: "contain",
                          margin: 10,
                          // ...AppStyles.dropShadow(),
                        }}
                        source={require("../assets/closeModal.png")}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "column" }}>
                    <TextInput
                      style={{
                        paddingLeft: 30,
                        height: 60,
                        fontSize: 18,
                        opacity: 0.6,
                      }}
                      value={sharedPostTitle}
                      placeholder={"Say something about this..."}
                      placeholderTextColor="#738388"
                      onChangeText={this.updateTitleText}
                    />
                  </View>
                  <TouchableOpacity onPress={this.internalPostShare}>
                    <View style={styles.item1}>
                      <Image
                        style={{
                          width: 18,
                          height: 18,
                          marginHorizontal: 10,
                        }}
                        resizeMode="contain"
                        source={require("../assets/shareOther.png")}
                      />
                      <Text style={[styles.title, { fontWeight: "bold" }]}>
                        Internal
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.externalPostShare}>
                    <View style={styles.item1}>
                      <Image
                        style={{
                          width: 18,
                          height: 18,
                          marginHorizontal: 10,
                        }}
                        resizeMode="contain"
                        source={require("../assets/shareOther.png")}
                      ></Image>
                      <Text style={[styles.title, { fontWeight: "bold" }]}>
                        External
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </RBSheet>

              {/* RBSheet For Post Display Status */}

              <RBSheet
                ref={(ref) => {
                  this.RBSheetForPostDisplayStatus = ref;
                }}
                closeOnDragDown={true}
                height={isMyPost ? 160 : 130}
                openDuration={250}
                customStyles={{
                  wrapper: {
                    backgroundColor: "rgba(52, 52, 52, 0.8)",
                  },
                  draggableIcon: {
                    backgroundColor: "transparent",
                  },
                  container: {
                    borderTop: 0.5,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: "#F7F7F7",
                  },
                }}
              >
                <View
                  style={{
                    marginHorizontal: Metrics.baseMargin,
                  }}
                >
                  {/* <TouchableOpacity
                    onPress={() => this.RBSheetForPostDisplayStatus.close()}
                    style={{
                      justifyContent: "flex-end",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                      }}
                      source={require("../assets/closeModal.png")}
                    />
                  </TouchableOpacity> */}

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                      borderBottomWidth: 0.7,
                      borderBottomColor: "#738388",
                      paddingBottom: 5,
                    }}
                    activeOpacity={0.5}
                    onPress={this.hidePostHander}
                  >
                    <Image
                      source={images.hide}
                      style={{
                        width: Metrics.widthRatio(18),
                        height: Metrics.widthRatio(18),
                      }}
                    />
                    <Text
                      style={{
                        marginLeft: Metrics.smallMargin,
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Hide
                    </Text>
                  </TouchableOpacity>

                  {isMyPost && (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 10,
                        borderBottomWidth: 0.7,
                        borderBottomColor: "#738388",
                        paddingBottom: 5,
                      }}
                      activeOpacity={0.5}
                      onPress={this.deletePostHandler}
                    >
                      <Image
                        source={images.delete}
                        style={{
                          width: Metrics.widthRatio(20),
                          height: Metrics.widthRatio(20),
                        }}
                      />
                      <Text
                        style={{
                          marginLeft: Metrics.smallMargin,
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                      borderBottomWidth: 0.7,
                      borderBottomColor: "#738388",
                      paddingBottom: 5,
                    }}
                    activeOpacity={0.5}
                    onPress={this.reportPostHander}
                  >
                    <Image
                      source={images.flag}
                      style={{
                        width: Metrics.widthRatio(20),
                        height: Metrics.widthRatio(20),
                      }}
                    />
                    <Text
                      style={{
                        marginLeft: Metrics.smallMargin,
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      Report
                    </Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>
            </>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

const actions = { request, generalSaveAction, multipleRequest, getPostRequest };
const mapStateToProps = ({ posts, user, watchList, generalPosts }) => ({
  posts: posts["data"],
  watchList: watchList["data"],
  generalPosts: generalPosts["data"],
  user: user["data"].user,
});

export default connect(mapStateToProps, actions)(Home);
