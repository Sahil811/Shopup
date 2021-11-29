import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import useStyles from "../utils/styles";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@material-ui/core";
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { getError } from "../utils/error";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { Store } from "../utils/store";

/// Redux Toolkit ///
import { useSelector, useDispatch } from "react-redux";
import { mapLocationActionCreator } from "../redux/slices/cart";

const defaultLocation = { lat: 45.516, lng: -73.5 };
const libs = ["places"];

function Map() {
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  // const { state, dispatch } = useContext(Store);
  // const { userInfo } = state;

  const [googleApiKey, setGoogleApiKey] = useState("");

  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        const { data } = await axios("/api/keys/google", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setGoogleApiKey(data);
        getUserCurrentLocation();
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    };
    fetchGoogleApiKey();
  }, []);

  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      enqueueSnackbar("Geolocation is not supported by this browser", {
        variant: "error",
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };
  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };

  const onPlacesChanged = () => {
    const places = placeRef?.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0].geometry.location;
      setCenter({ lat: place.lat(), lng: place.lng() });
      setLocation({ lat: place.lat(), lng: place.lng() });
    }
    return;
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      // dispatch({
      //   type: "SAVE_SHIPPING_ADDRESS_MAP_LOCATION",
      //   payload: {
      //     lat: location.lat,
      //     lng: location.lng,
      //     address: places[0].formatted_address,
      //     name: places[0].name,
      //     vicinity: places[0].vicinity,
      //     googleAddressId: places[0].id,
      //   },
      // });
      dispatch(
        mapLocationActionCreator({
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        })
      );
      enqueueSnackbar("location selected successfully", {
        variant: "success",
      });
      router.push("/shipping");
    }
  };
  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };
  return googleApiKey ? (
    <div className={classes.fullContainer}>
      <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={center} // 	The initial Map center.
          zoom={15}
          onLoad={onLoad} // This callback is called when the map instance has loaded. It is called with the map instance.
          onIdle={onIdle} // This event is fired when the map becomes idle after panning or zooming.
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces} // This callback is called when the searchBox instance has loaded. It is called with the searchBox instance.
            onPlacesChanged={onPlacesChanged} // This callback is called when the user selects a prediction and clicks "search". It is called with the searchBox instance.
            // 	This event is fired when the user selects a query, getPlaces should be used to get new places.
          >
            <div className={classes.mapInputBox}>
              <input type="text" placeholder="Enter your address"></input>
              <button type="button" className="primary" onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </StandaloneSearchBox>

          <Marker
            position={location} // The position you want to place the marker.
            onLoad={onMarkerLoad} // This callback is called when the marker instance has loaded. It is called with the marker instance.
          ></Marker>
        </GoogleMap>
      </LoadScript>
    </div>
  ) : (
    <CircularProgress />
  );
}

export default dynamic(() => Promise.resolve(Map), { ssr: false });
