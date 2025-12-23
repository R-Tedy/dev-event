"use client"

import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react";

interface Props {
  eventId: string;
  slug: string;
}

const BookEvent = ({eventId, slug}: Props) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {success} = await createBooking({eventId, slug, email});

    if (success) {
      setSubmitted(true);
      posthog.capture('event-booked', {eventId, slug, email});
    } else {
      console.error('Booking creation failed');
      posthog.captureException('Booking creation failed')
    }
  }

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              value={email} 
              id="email" 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>

          <button type="submit" className="button-submit">Submit</button>
        </form>
      )}
    </div>
  )
}

export default BookEvent