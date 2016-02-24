lethexa-kepler
---------------

Library for calculating the orbits of astronomical objects.

Installation
------------

	npm install
	grunt

Usage
-----

	var kepler = require('lethexa-kepler');

	var julianDate = new kepler.JulianDate(1,1,2015,12,0,0);
	console.log('Startime: ' + julianDate.getStarTime());

        var orbiter = new kepler.Orbiter();
	console.log(orbiter.getPositionAtTime(1.0));

License
-------

This library is published under MIT license.

