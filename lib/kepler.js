(function (exports) {
  'use strict';

  var ASTRONOMICAL_UNIT = 149597870691.0; // [m]

  var arc000_360 = function(arc) {
    while(arc >= 360) arc -= 360;
    while(arc < 0) arc += 360;
    return arc;
  };

  var radians = function(w) {
    return w * Math.PI / 180.0;
  };
 
 
  /**
   * Creates the julian date of the given time
   * @class JulianDate
   * @constructor
   * @param {Object} date 
   *   @param {Number} day The day 
   */
  exports.JulianDate = function(date) {
    date = date || {};
    var day = date.day || 1;
    var month = date.month || 1;
    var year = date.year || 0;
    var hour = date.hour || 0;
    var minute = date.minute || 0;
    var second = date.second || 0;

    /**
     * Calculates the julian day.
     * @method calcJulianDay
     * @param day {Number} The day.
     * @param month {Number} The month.
     * @param year {Number} The year.
     * @return the julian day. 
     */
    var calcJulianDay = function(RefDay, RefMonth, RefYear) {
      var Year = RefYear;
      var Month = RefMonth;
      var Day = RefDay;

      var X = Year * 10000.0 + Month * 100.0 + Day;
      if(Month <= 2.0) {
        Year -= 1.0;
        Month += 12.0;
      }
      var A = Math.floor(Year / 100.0);
      var B = X < 1582104.1 ? 0.0 : 2.0 - A + Math.floor(A / 4.0);

      return Math.floor((365.25 * (Year + 4716.0)) + Math.floor(30.60001 * (Month + 1.0)) + Day + B - 1524.5);
    };

    /**
     * Gives the julian date as string.
     * @method asString
     * @return {String} The date as string. 
     */ 
    this.asString = function() {
      var Z = Math.floor(self.__JulianDay + 0.5);
      var X = Math.floor((Z - 1867216.25) / 36524.25);
      var A = Z + 1.0 + X - Math.floor(X / 4.0);

      if(Z < 2299161.0)
        A = Z;

      var B = A + 1524.0;
      var C = Math.floor((B - 122.1) / 365.25);
      var D = Math.floor(365.25 * C);
      var E = Math.floor((B - D) / 30.6001);

      var Day = B - D - Math.floor(30.6001 * E);
      var Month = E < 14 ? E - 1.0 : E - 13.0;
      var Year = Month > 2.0 ? C - 4716.0 : C - 4715.0;

      var FracDay = julianDay + 0.50000001;

      var hour = (FracDay - Math.floor(FracDay)) * 24.0;
      var minute = (Hour - Math.floor(Hour)) * 60.0;
      var second = (Minute - Math.floor(Minute)) * 60.0;
      second = Math.floor(Second * 1000.0) / 1000.0;

      return "" + Day + "." + Month + "." + Year + " " + Hour + ":" + Minute + ":" + Second;
    };

    /**
     * Returns the star time [0°..360°].
     * @method getStarTime
     * @return The star time.
     */
    this.getStarTime = function(correct) {
      var T = (julianDay - 2451545.0) / 36525.0;
      var T2 = T * T;
      var T3 = T2 * T;
      var StarTime = 100.460618375 + 36000.77005360833 * T + 0.0003879333 * T2 - T3 / 38710000.0;
      StarTime = arc000_360(StarTime);
      return StarTime + (correct === undefined ? 0 : correct);
    };


    /**
     * Returns the julian day.
     * @method getJulianDay
     * @return The julian day.
     */
    this.getJulianDay = function() {
      return julianDay;
    };    

    var julianDay = calcJulianDay(day, month, year);
    julianDay += hour / 24.0 + minute / (24.0 * 60.0) + second / (24.0 * 3600.0);
  };


  /**
   * The orbiting object.
   */
  exports.Orbiter = function(options) {
    options = options || {};
    var dailyMotion = options.dailyMotion || 1.0;
    var meanLongitude = options.meanLongitude || 262.4278;
    var lonPerihelion = options.lonPerihelion || 336.0882;
    var eccentricity = options.eccentricity || 0.0934231;
    var semiMajor = options.semiMajor || 1.5236365;
    var lonAscNode = options.lonAscNode || 49.5664;
    var inclination = options.inclination || 1.84992;
    var arcToEcliptic = options.arcToEcliptic || 23.45;

    this.getPositionAtTime = function(daysSinceEpoch) {
      var M = dailyMotion * daysSinceEpoch + meanLongitude - lonPerihelion;
      M = arc000_360(M);
 
      // E annaehern...
      var RadV;
      var RadM = radians(M);
      var V = M + (180.0 / Math.PI) * eccentricity * Math.sin(RadM) * (1.0 + eccentricity * Math.cos(RadM));
      for(var i=0;i<1;i++) {
        RadV = radians(V);
        V = V - (V - (180.0 / Math.PI) * eccentricity * Math.sin(RadV) - M) / (1.0 - eccentricity * Math.cos(RadV));
      }
      V = arc000_360(V);
 
      RadV = radians(V);
      var R = 1000 * semiMajor * (1.0 - eccentricity * eccentricity) / (1.0 + eccentricity * Math.cos(RadV));
      var RadP = radians(lonPerihelion);
      var RadO = radians(lonAscNode);
      var RadI = radians(inclination);

      var X = R * (Math.cos(RadO) * Math.cos(RadV + RadP - RadO) - Math.sin(RadO) * sin(RadV + RadP - RadO) * Math.cos(RadI));
      var Y = R * (Math.sin(RadO) * Math.cos(RadV + RadP - RadO) + Math.cos(RadO) * sin(RadV + RadP - RadO) * Math.cos(RadI));
      var Z = R * (Math.sin(RadV + RadP - RadO) * Math.sin(RadI));
      return [X,Y,Z];
    };
  };


  exports.EquinoxTime = new exports.JulianDate(20, 3, 2010, 17, 32, 0);

})(typeof exports === 'undefined' ? this.kepler = {} : exports);

