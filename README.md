# Travel Wishlist

A browser-based app for saving and organizing travel destinations.
School midterm project — built with Vite, vanilla HTML, CSS, and JavaScript.

---

## Project Overview

Travel Wishlist lets users keep a personal list of places they want to visit.
Each destination can include a name, region, personal notes, and a star rating.
All data is saved in the browser using `localStorage`, so nothing is lost on refresh
and no back-end server is needed.

---

## Target Users

- Students or travelers who want a simple way to track dream destinations
- Anyone who prefers a lightweight, offline-capable tool with no sign-up required

---

## Planned Features

| Feature | Description |
|---|---|
| Add destinations | Save a new place with name, region, notes, and rating |
| Edit destinations | Update any field of a saved destination |
| Delete destinations | Remove a destination from the list |
| Add notes and ratings | Attach personal notes and a 1–5 star rating to each destination |
| Filter by region | Show only destinations that match a selected region |

---

## Data Persistence (localStorage)

All destinations are stored as a JSON array under the key `travelWishlist`
in the browser's `localStorage`. No external database or API is required.

### Example Data Structure

```json
[
  {
    "id": "abc123",
    "name": "Kyoto",
    "region": "Asia",
    "notes": "Cherry blossom season in April looks amazing.",
    "rating": 5,
    "createdAt": "2026-03-09T10:00:00.000Z"
  },
  {
    "id": "def456",
    "name": "Lisbon",
    "region": "Europe",
    "notes": "Great food, affordable, and beautiful tram rides.",
    "rating": 4,
    "createdAt": "2026-03-09T11:30:00.000Z"
  }
]
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier for each destination |
| `name` | string | Name of the destination |
| `region` | string | Geographic region (e.g. Asia, Europe, Americas) |
| `notes` | string | Personal notes about the destination |
| `rating` | number | Rating from 1 to 5 |
| `createdAt` | string | ISO 8601 timestamp set when the destination is added |

---

## CRUD Operations

| Operation | Description |
|---|---|
| **Create** | Read the current array from `localStorage`, push a new destination object, save back |
| **Read** | Parse the JSON array from `localStorage` and render it to the page |
| **Update** | Find the destination by `id`, modify the fields, save the updated array back |
| **Delete** | Filter out the destination by `id`, save the remaining array back |

---

## Deployment Plan

1. Push the repository to GitHub.
2. Go to **Settings > Pages** in the GitHub repository.
3. Set the source to the `main` branch and the `/` (root) or `dist` folder.
4. Run `npm run build` to generate the `dist/` folder, then push it, or enable
   GitHub Actions to build automatically on push.
5. The site will be live at `https://<username>.github.io/<repo-name>/`.

---

## File Structure

```
travel-wishlist/
├── index.html        # Main HTML page
├── src/
│   ├── style.css     # All styles
│   └── main.js       # JavaScript entry point
├── README.md         # This file
├── package.json      # Vite dev dependency
└── vite.config.js    # (if needed)
```

---

## Next Steps for Week 8

- [ ] Build the destination form (name, region, notes, rating inputs)
- [ ] Implement `localStorage` read/write helpers
- [ ] Render the destination list dynamically from stored data
- [ ] Add edit and delete buttons per destination card
- [ ] Add a region filter dropdown
- [ ] Polish the UI and test on mobile
