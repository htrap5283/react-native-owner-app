import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { db } from "../config/FirebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import * as Location from "expo-location";

const CreateListingScreen = ({ route }) => {
  const { userID, userEmail, userData } = route.params;

  const [vehicleData, setVehicleData] = useState([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [photo, setPhoto] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [horsepower, setHorsepower] = useState("");
  const [acceleration, setAcceleration] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [message, setMessage] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const requestLocationPermission = async () => {
    try {
      const permissionObject =
        await Location.requestForegroundPermissionsAsync();
      if (permissionObject.status === "granted") {
        console.log(`Location permission granted`);
      } else {
        console.log(`Location permission denied`);
      }
    } catch (err) {
      console.log(`Error while requesting location permission: ${err}`);
    }
  };

  const fetchVehicleData = async () => {
    let apiURL = `https://dhruvtailor.github.io/VehicleJson/vehicles.json`;
    console.log(`apiURL: ${apiURL}`);
    await fetch(apiURL)
      .then((response) => {
        console.log(`Response status:${response.status}`);
        if (response.ok) {
          console.log(`Response okay from Server ${JSON.stringify(response)}`);
          return response.json();
        } else {
          console.log(`Unsuccessful Response from server : ${response.status}`);
        }
      })
      .then((jsonData) => {
        console.log(`Objects received: ${jsonData.length}`);
        setVehicleData(jsonData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(`Error while connecting to API: ${JSON.stringify(error)}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicleData();
    requestLocationPermission();
  }, []);

  const searchVehicle = () => {
    let found = false;
    for (let i = 0; i < vehicleData.length; i++) {
      const vehicle = vehicleData[i];
      if (
        vehicle.make.toLowerCase() === make.toLowerCase() &&
        vehicle.model.toLowerCase() === model.toLowerCase()
      ) {
        setVehicleName(`${vehicle.make} ${vehicle.model} ${vehicle.trim}`);
        setPhoto(vehicle.images[0].url_full);
        setSeatingCapacity(vehicle.seats_max.toString());
        setHorsepower(vehicle.horsepower.toString());
        setAcceleration(vehicle.acceleration.toString());
        setMessage("");
        setFormVisible(true);
        found = true;
        break;
      }
    }
    if (!found) {
      resetForm();
      setMessage("No record found");
      setFormVisible(false);
      found = false
    }
  };

  const resetForm = () => {
    setMake("");
    setModel("");
    setVehicleName("");
    setPhoto("");
    setSeatingCapacity("");
    setHorsepower("");
    setAcceleration("");
    setLicensePlate("");
    setRentalPrice("");
    setPickupLocation("");
  }

  const doGeocoding = async (address) => {
    try {
      const geocodedLocations = await Location.geocodeAsync(address);
      console.log(`geocodedLocations : ${JSON.stringify(geocodedLocations)}`);

      if (geocodedLocations !== undefined) {
        const result = geocodedLocations[0];

        if (result !== undefined) {
          console.log(`result : ${JSON.stringify(result)}`);
          console.log(`result.latitude : ${result.latitude}`);
          console.log(`result.longitude : ${result.longitude}`);

          const postalAddressList = await Location.reverseGeocodeAsync({
            latitude: result.latitude,
            longitude: result.longitude,
          });
          console.log(
            `postalAddressList : ${JSON.stringify(postalAddressList)}`
          );

          let city = "";
          if (postalAddressList.length > 0) {
            const addressResult = postalAddressList[0];
            console.log(`result : ${JSON.stringify(addressResult)}`);
            city = addressResult.city;
          } else {
            console.log(`No address found for given coordinates`);
          }

          return {
            latitude: result.latitude,
            longitude: result.longitude,
            city: city,
          };
        } else {
          console.log(
            `No location coordinates available for the given address`
          );
        }
      } else {
        console.log(`No location coordinates available for the given address`);
      }
    } catch (error) {
      console.log(`Error performing geocoding: ${error}`);
    }
    return { latitude: null, longitude: null, city: "" };
  };

  const handleCreateListing = async () => {
    const { latitude, longitude, city } = await doGeocoding(pickupLocation);

    console.log(`Latitude before saving: ${latitude}`);
    console.log(`Longitude before saving: ${longitude}`);
    console.log(`City before saving: ${city}`);

    try {
      const newListing = {
        vehicleName,
        photo,
        seatingCapacity,
        horsepower,
        acceleration,
        licensePlate,
        pickupLocation,
        rentalPrice,
        latitude,
        longitude,
        city,
        userID,
        userEmail,
        ownerName: userData.name,
        ownerPhoto: userData.photo
      };

      console.log(`Document to be added: ${JSON.stringify(newListing)}`);

      const collectionRef = collection(db, "owners_listings");
      const docRef = await addDoc(collectionRef, newListing);

      alert("New Listing created successfully and added to the database");
      console.log(`Document added successfully ${JSON.stringify(docRef)}`);
      console.log(`Document inserted with the id : ${docRef.id}`);

      resetForm();
      setFormVisible(false)
    } catch (err) {
      console.log(`Error while inserting in the database : ${err}`);
    }
  };

  const isFormValid = () => {
    return (
      make &&
      model &&
      vehicleName &&
      photo &&
      seatingCapacity &&
      horsepower &&
      acceleration &&
      licensePlate &&
      pickupLocation &&
      rentalPrice
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headingText}>Create a Car Listing</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#2d9cdb" animating={true} />
          ) : (
            <>
              <View style={styles.inputRow}>
                <Text style={styles.label}>Make</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter vehicle make"
                  value={make}
                  onChangeText={setMake}
                  inputMode="text"
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.label}>Model</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter vehicle model"
                  value={model}
                  onChangeText={setModel}
                  inputMode="text"
                />
              </View>
              <Pressable style={styles.button} onPress={searchVehicle}>
                <Text style={styles.buttonText}>Search Vehicle</Text>
              </Pressable>

              {message ? <Text style={styles.error}>{message}</Text> : null}

              {formVisible && (
                <>
                  <Image source={{ uri: photo }} style={styles.image} />
                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Vehicle Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Vehicle Name"
                      value={vehicleName}
                      onChangeText={setVehicleName}
                      inputMode="text"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Seating Capacity</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Seating Capacity"
                      value={seatingCapacity}
                      onChangeText={setSeatingCapacity}
                      inputMode="numeric"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Horsepower</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Horsepower"
                      value={horsepower}
                      onChangeText={setHorsepower}
                      inputMode="numeric"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Acceleration</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Acceleration"
                      value={acceleration}
                      onChangeText={setAcceleration}
                      inputMode="numeric"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.label}>License Plate</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter License Plate"
                      value={licensePlate.toUpperCase()}
                      onChangeText={(text) =>
                        setLicensePlate(text.toUpperCase())
                      }
                      inputMode="text"
                      maxLength={8}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Rental Price</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Rental Price"
                      value={`$${rentalPrice}`}
                      onChangeText={(text) =>
                        setRentalPrice(text.replace(/[^0-9.]/g, ""))
                      }
                      inputMode="decimal"
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <Text style={styles.label}>Pickup Location</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Pickup Location"
                      value={pickupLocation}
                      onChangeText={setPickupLocation}
                      inputMode="text"
                    />
                  </View>

                  <Pressable
                    style={[
                      styles.button,
                      !isFormValid() && styles.buttonDisabled,
                    ]}
                    onPress={handleCreateListing}
                    disabled={!isFormValid()}
                  >
                    <Text style={styles.buttonText}>Create Listing</Text>
                  </Pressable>
                </>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2d9cdb",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
  },
});
