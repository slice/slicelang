(defn factory []
  (ret (fn []
    (log "hello")
  ))
)

(def created (factory))
(created)
