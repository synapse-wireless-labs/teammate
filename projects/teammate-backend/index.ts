import bleno from "bleno";

const service = new bleno.PrimaryService({
  uuid: "12ab",
  characteristics: [
    new bleno.Characteristic({
      value: null,
      uuid: "34cd",
      properties: ["notify", "read", "write"],

      // If the client subscribes, we send out a message every 1 second
      onSubscribe(this: any, maxValueSize, updateValueCallback) {
        console.log("Device subscribed");
        this.intervalId = setInterval(function() {
          console.log("Sending: Hi!");
          updateValueCallback(new Buffer("Hi!"));
        }, 1000);
      },

      // If the client unsubscribes, we stop broadcasting the message
      onUnsubscribe(this: any) {
        console.log("Device unsubscribed");
        clearInterval(this.intervalId);
      },

      // Send a message back to the client with the characteristic's value
      onReadRequest(this: any, offset, callback) {
        console.log("Read request received");
        callback(
          this.RESULT_SUCCESS,
          new Buffer(
            "Echo: " + (this.value ? this.value.toString("utf-8") : "")
          )
        );
      },

      // Accept a new value for the characterstic's value
      onWriteRequest(this: any, data, offset, withoutResponse, callback) {
        this.value = data;
        console.log("Write request: value = " + this.value.toString("utf-8"));
        callback(this.RESULT_SUCCESS);
      }
    })
  ]
});

bleno.on("stateChange", function(state) {
  console.log("State change: " + state);
  if (state === "poweredOn") {
    bleno.startAdvertising("Teammate", ["12ab"]);
  } else {
    bleno.stopAdvertising();
  }
});

// Notify the console that we've accepted a connection
bleno.on("accept", function(clientAddress) {
  console.log("Accepted connection from address: " + clientAddress);
});

// Notify the console that we have disconnected from a client
bleno.on("disconnect", function(clientAddress) {
  console.log("Disconnected from address: " + clientAddress);
});

// When we begin advertising, create a new service and characteristic
bleno.on("advertisingStart", function(error) {
  if (error) {
    console.log("Advertising start error:" + error);
  } else {
    console.log("Advertising start success");
    bleno.setServices([service]);
  }
});
