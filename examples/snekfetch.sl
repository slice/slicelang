(def snek (require "snekfetch"))
(def req (snek.get "http://httpbin.org/user-agent"))
(defn promiseHandler [result]
  (log result.body))
(req.then (fn [result]
  (log result.body)
))
