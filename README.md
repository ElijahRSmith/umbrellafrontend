# umbrellafrontend

The purpose of this app is to tell a user whether or not to bring an umbrella to any of their
outdoor activities within the next 24 hours. A user inputs the highest rain probability they
are willing to tolerate without an umbrella, as well as all the places and times (up to 4)
that they will be outside.

The app processes the locations and times and then returns the average chance it will 
rain in any of those locations during any of those times. It does this by first querying
the Google Maps API database to retrieve the latitude and longitude of the locations, then
querying the Microsoft Azure API database for 24 hour forecast data in those locations, and then 
finally pulling from that data the chances of rain during each hour and averaging all those
that correpond to the user-inputted times.

The average chance of rain is compared to the user's tolerance. If it is greater, text
is displayed advising the user to bring an umbrella. If it is not, text is displayed saying
the opposite.

This app was created as the final project in a Web Design class at Grand Valley State University.
It uses the create-react-app module for the front-end and an express back-end proxy server to send
the API requests. The express server is not included in this repository.
