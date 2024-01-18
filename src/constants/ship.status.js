export default {
    PREPARING: "PREPARING", // Shipment preparation at postoffice before send
    DELIVERING: "DELIVERING", // Shipment status along the way
    RECEIVED: "RECEIVED", // Shipment was successfully shipped | Transaction was received by des department
    SENT: "SENT", // Transaction was sent by pos department
    HOLD: "HOLD", // Transaction was hold at des department
    PASSED: "PASSED", // Transaction was passed by des department
}