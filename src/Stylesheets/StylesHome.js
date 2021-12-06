import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  movieBoxView: {
    marginTop: 10,
    width: "100%",
    borderRadius: 7,
    // borderWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
    padding: 10,
  },
  headTitle: {
    fontFamily: "SF-SemiBold",
    fontSize: 22,
    fontWeight: "600",
    alignSelf: "center",
    color: "#060606",
  },
  backArrow: {
    width: "100%",
    height: "8%",
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  writeReview: {
    width: "100%",
    height: 60,
    backgroundColor: "#738388",
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  container: {
    flex: 1,
  },
  halfScreen: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    borderColor: "red",
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  sideBar: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  Viewed: {
    width: 100,
    height: 60,
    resizeMode: "contain",
  },
  writeView: {
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
  },
  write: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "SF-Regular",
    color: "#fff",
    paddingHorizontal: 10,
  },
  writeIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    paddingHorizontal: 10,
  },
  bellIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  writeTouch: { width: "100%", height: "100%" },
  Number: {
    color: "white",
    fontSize: 11,
  },
  notificationView: {
    backgroundColor: "#FF0000",
    borderRadius: 8.5,
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: "white",
    right: 10,
    top: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    position: "absolute",
  },

  item: {
    paddingTop: 10,
    padding: 10,
    marginVertical: 0,
    marginHorizontal: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  item1: {
    padding: 10,
    marginVertical: 0,
    marginHorizontal: 0,
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#738388",
    borderWidth: 0.5,
  },
  title: {
    fontSize: 18,
    color: "#000000",
    width: "100%",
    fontWeight: "900",
  },
});
