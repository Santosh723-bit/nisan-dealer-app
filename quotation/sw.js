/* Quotation app retired 24 Nov 2026: this worker removes its old caches and itself. */
self.addEventListener("install",function(){self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n.indexOf("npro-quote")===0}).map(function(n){return caches.delete(n)}))}).then(function(){return self.registration.unregister()}).then(function(){return self.clients.matchAll()}).then(function(cs){cs.forEach(function(c){try{c.navigate(c.url)}catch(x){}})}))});
