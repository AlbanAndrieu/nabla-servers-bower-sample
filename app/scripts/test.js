/*jshint strict: false */
import mixpanel from 'mixpanel-browser';

mixpanel.init("e28ee9625ec33982c6f8666ed974382c", { debug: true, ignore_dnt: true, track_pageview: true, persistence: "localStorage" });

console.log("'Allo 'Allo!");
