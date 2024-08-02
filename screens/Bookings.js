import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Image } from 'react-native';
import { db } from '../config/FirebaseConfig';
import { collection, getDocs, updateDoc, doc, query, where, onSnapshot } from 'firebase/firestore';

const Bookings = ({ route }) => {
    const { userID, userEmail } = route.params;

    const [bookings, setBookings] = useState([]);

    const fetchBookings = () => {
        const bookingsCollection = collection(db, 'bookings');
        const userQuery = query(bookingsCollection, where("ownerId", "==", userID));

        const unsubscribe = onSnapshot(userQuery, (snapshot) => {
            const bookingList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(bookingList);
        });

        return () => unsubscribe();
    };

    // const fetchBookings = async () => {
    //     const bookingsCollection = collection(db, 'bookings');
    //     const userQuery = query(bookingsCollection, where("ownerId", "==", userID))
    //     const bookingSnapshot = await getDocs(userQuery)
    //     //const bookingSnapshot = await getDocs(bookingsCollection);
    //     const bookingList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //     setBookings(bookingList);
    // };

    useEffect(() => {
        fetchBookings();
    }, []);

    const approveBooking = async (bookingId) => {
        const confirmationCode = generateConfirmationCode(); // Generate confirmation code
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, {
            bookingStatus: 'Approved',
            confirmationCode: confirmationCode,
        });
        // Refresh bookings
        fetchBookings();
    };

    const declineBooking = async (bookingId) => {
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, {
            bookingStatus: 'Declined',
        });
        // Refresh bookings
        fetchBookings();
    };

    const BookingCard = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.vehicleImage} />
            <View style={styles.cardContent}>
                <Text style={styles.vehicleName}>{item.vehicleName}</Text>
                <Text>Booking Date: {item.bookingDate}</Text>
                <Text>License Plate: {item.licensePlate}</Text>
                <Text>Price: ${item.rentalPrice}/week</Text>
                <View style={styles.renterInfo}>
                    <Image source={{ uri: item.renterPhoto }} style={styles.renterPhoto} />
                    <Text style={styles.renterName}>{item.renterName}</Text>
                </View>
                <Text style={styles.status}>Status: {item.bookingStatus}</Text>
                {item.bookingStatus === "Approved" && (
                    <Text style={styles.confirmationCode}>
                        Confirmation Code: {item.confirmationCode}
                    </Text>
                )}
                {item.bookingStatus === "Declined" && (
                    <Text style={styles.declinedText}>
                        Booking is declined
                    </Text>
                )}
                {item.bookingStatus === "Needs Approval" && (
                    <View style={styles.buttonContainer}>
                        <Text style={styles.approveButton} onPress={() => approveBooking(item.id)}>
                            Approve
                        </Text>
                        <Text style={styles.declineButton} onPress={() => declineBooking(item.id)}>
                            Decline
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <>{
            (bookings.length === 0) ?
                <View style={styles.emptyView}>
                    <Text style={styles.emptyTitle}>No bookings found</Text>
                </View> :
                <View style={styles.container}>
                    <FlatList
                        data={bookings}
                        renderItem={({ item }) => <BookingCard item={item} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.container}
                    />
                </View>
        }</>


    );
};

const generateConfirmationCode = () => {
    // Generate a random confirmation code (e.g., alphanumeric)
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    vehicleImage: {
        width: "100%",
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    cardContent: {
        padding: 16,
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    renterInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 8,
    },
    renterPhoto: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    renterName: {
        fontWeight: "bold",
    },
    status: {
        fontWeight: "bold",
        marginTop: 8,
    },
    confirmationCode: {
        marginTop: 8,
        color: "green",
        fontWeight: "bold",
    },
    declinedText: {
        marginTop: 8,
        color: "red",
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    approveButton: {
        backgroundColor: "#4CAF50",
        color: "white",
        padding: 8,
        borderRadius: 4,
    },
    declineButton: {
        backgroundColor: "#F44336",
        color: "white",
        padding: 8,
        borderRadius: 4,
    },
    emptyView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "gray",
    },
});

export default Bookings;