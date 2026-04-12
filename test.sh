curl -G "https://maps.googleapis.com/maps/api/distancematrix/json" \
    --data-urlencode "origins=40.79,-73.965" \
    --data-urlencode "destinations=40.7825547,-73.9655834" \
    --data-urlencode "key=YOUR_GOOGLE_API_KEY"
