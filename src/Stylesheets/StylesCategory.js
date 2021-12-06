import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    item: {
        padding: 20,
        marginVertical: 0,
        marginHorizontal: 0,
        flex: 1,
        flexDirection: "row",
        borderColor: "#738388",
        borderTopWidth: 0.5,
        alignItems: "center",
      },
      title: {
        fontFamily: "SF-SemiBold",
        fontSize: 16,
        color: "#000000",
        fontWeight: "bold",
        width: "100%",
        marginLeft: 15,
        paddingTop: 5,
      },
      listView: {
        backgroundColor: "#fff",
        borderWidth: 0.5,
        borderRadius: 50,
        borderColor: "#DFDFDF",
        width: 50,
        height: 50,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
      },
      logoImage: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        alignSelf: "center",
      },
      isChecked: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: "#D8D8D8",
      },
      searchView: {
        flexDirection: "row",
        width: "100%",
        height: 70,
        paddingHorizontal: 20,
        alignItems: "center",
      },
      searchBar: {
        marginLeft: 15,
        marginTop: 5,
        width: "100%",
        borderWidth: 0,
        height: 40,
        justifyContent: "center",
      },
      container: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
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
});
