import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "65106434f1c85849e119a27a4efb8a18";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("09:00:00")) {
          return weather;
        }
      })
    );
  };
  const dateFormat = (dateTxt) => {
    let date = new Date(dateTxt);

    return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시`;
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, idx) => {
            return (
              <View key={idx} style={styles.day}>
                <Text style={styles.date}>{dateFormat(day.dt_txt)}</Text>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Text style={styles.description}>{day.weather[0].main}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: 500,
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  date: {
    fontSize: 30,
  },
  temp: {
    fontSize: 178,
    // marginTop: 50,
  },
  description: {
    marginTop: -30,
    fontSize: 50,
  },
});
