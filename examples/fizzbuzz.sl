(for (def i 1) (ne i 50) (adef i 1)
  (if (eq (mod i 15) 0)
    (log "Fizz Buzz")
    (next)
  )
  (if (eq (mod i 3) 0)
    (log "Fizz")
    (next)
  )
  (if (eq (mod i 5) 0)
    (log "Buzz")
    (next)
  )
  (log i)
)
