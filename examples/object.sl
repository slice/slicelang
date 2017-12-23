(def thing
  { "key": "value",
    "another_key": "value"
    "syntax": "cool"
  }
)
(def inline { "key": "value", "another_key": "value" })
(def sing { "oh no": "waaah" })

(def util (require "util"))
(def inspect util.inspect)
(def objects_to_inspect [ thing inline sing ])

(fore object objects_to_inspect
  (log (inspect object { "depth": null }))
)
