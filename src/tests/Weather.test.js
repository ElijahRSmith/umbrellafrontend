import { selectForecasts, fixZone, averagePrecip, fmtTime } from '../Weather.js';


describe("Weather", () => {
  let data
  let fcArray
  /* 
  *   I chose to use this overly-verbose method because it makes 
  *   it much easier to customize the "date" value.
  */
  fcArray = [
              { date: "2020-04-21T04:00:00+00:00", precipitationProbability: 10},
              { date: "2020-04-21T05:00:00+00:00", precipitationProbability: 20},
              { date: "2020-04-21T06:00:00+00:00", precipitationProbability: 30},
              { date: "2020-04-21T07:00:00+00:00", precipitationProbability: 40},
              { date: "2020-04-21T08:00:00+00:00", precipitationProbability: 50},
              { date: "2020-04-21T09:00:00+00:00", precipitationProbability: 60},
              { date: "2020-04-21T10:00:00+00:00", precipitationProbability: 70},
              { date: "2020-04-21T11:00:00+00:00", precipitationProbability: 80},
              { date: "2020-04-21T12:00:00+00:00", precipitationProbability: 90},
              { date: "2020-04-21T13:00:00+00:00", precipitationProbability: 100},
              { date: "2020-04-21T14:00:00+00:00", precipitationProbability: 10},
              { date: "2020-04-21T15:00:00+00:00", precipitationProbability: 20},
              { date: "2020-04-21T16:00:00+00:00", precipitationProbability: 30},
              { date: "2020-04-21T17:00:00+00:00", precipitationProbability: 40},
              { date: "2020-04-21T18:00:00+00:00", precipitationProbability: 50},
              { date: "2020-04-21T19:00:00+00:00", precipitationProbability: 60},
              { date: "2020-04-21T20:00:00+00:00", precipitationProbability: 70},
              { date: "2020-04-21T21:00:00+00:00", precipitationProbability: 80},
              { date: "2020-04-21T22:00:00+00:00", precipitationProbability: 90},
              { date: "2020-04-21T23:00:00+00:00", precipitationProbability: 100},
              { date: "2020-04-22T00:00:00+00:00", precipitationProbability: 10},
              { date: "2020-04-22T01:00:00+00:00", precipitationProbability: 20},
              { date: "2020-04-22T02:00:00+00:00", precipitationProbability: 30},
              { date: "2020-04-22T03:00:00+00:00", precipitationProbability: 40}
            ];

  data = { forecasts: fcArray };

    describe("#fmtTime", () => {
      let value;

      it("returns correct time with a low value", () => {
        value = "00:00";
        expect(fmtTime(value)).toBe(0);
        value = "01:00";
        expect(fmtTime(value)).toBe(1);
      });
      it("returns correct time with a high value", () => {
        value = "23:00";
        expect(fmtTime(value)).toBe(23);
        value = "22:00";
        expect(fmtTime(value)).toBe(22);
      });
      it("returns correct time regardless of minutes", () => {
        value = "23:59";
        expect(fmtTime(value)).toBe(23);
        value = "00:01";
        expect(fmtTime(value)).toBe(0);
      });
    });

    describe("#fixZone", () => {
      let value;

      it("fixes timezone with a low value", () => {
        value = 0;
        expect(fixZone(value)).toBe(20);
        value = 1;
        expect(fixZone(value)).toBe(21);
      });

      it("fixes timezone with a high value", () => {
        value = 23;
        expect(fixZone(value)).toBe(19);
        value = 22;
        expect(fixZone(value)).toBe(18);
      });
    });

    describe("#averagePrecip", () => {
      let forecasts;

      it("calculates correct average with a small array", () => {
        forecasts = fcArray.slice(0, 2);
        expect(averagePrecip(forecasts)).toBeCloseTo(15, 5);
        forecasts = fcArray.slice(20, 23);
        expect(averagePrecip(forecasts)).toBeCloseTo(20, 5);
      });

      it("calculates correct average with a large array", () => {
        forecasts = fcArray.slice(0, 12);
        expect(averagePrecip(forecasts)).toBeCloseTo(48.33333, 5);
        forecasts = fcArray.slice(8);
        expect(averagePrecip(forecasts)).toBeCloseTo(52.5, 5);
      });

    })

    describe("#selectForecasts", () => { // Remember the timezone difference 
      let from;
      let to;

      it("selects correct forecasts with a small time block", () => {
        from = 5;
        to = 8;
        expect(selectForecasts(data, from, to)).toEqual(fcArray.slice(5, 8));
        from = 0;
        to = 2;
        expect(selectForecasts(data, from, to)).toEqual(fcArray.slice(0, 2));
      });

      it("selects correct forecasts with a large time block", () => {
        from = 0;
        to = 8;
        expect(selectForecasts(data, from, to)).toEqual(fcArray.slice(0, 8));
        from = 8;
        to = 19;
        expect(selectForecasts(data, from, to)).toEqual(fcArray.slice(8, 19));
      }); 

      it("selects correct forecasts with a time block that loops around", () => {
        from = 0;
        to = 3;
        expect(selectForecasts(data, from, to)).toEqual(fcArray.slice(0, 3));
      }); 
    })

})