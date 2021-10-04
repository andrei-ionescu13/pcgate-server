import { Product } from '../models/product.js';

export const listProducts = async (req, res, next) => {
  let { query, skip, limit, os, drm, genres, sortBy, sort } = req.body;

  sortBy = sortBy || 'release';
  sort = sort || -1;
  skip = skip || 0;
  limit = limit || 5;

  const match = {};

  match.name = {
    $regex: query || '',
    $options: 'i'
  }

  if (os && os.length) {
    os.forEach(x => {
      match[`platforms.${x}`] = true;
    });
  }

  if (drm && drm.length) {
    drm.forEach(x => {
      match[`drm.${x}`] = true;
    });
  }

  if (genres && genres.length) {
    match.genres = {
      $all: genres
    }
  }

  try {
    const result = await Product.aggregate([
      {
        $match: match,
      },
      {
        $sort: {
          [sortBy]: Number.parseInt(sort)
        }
      },
      {
        '$facet': {
          products: [{ $skip: skip }, { $limit: limit }],
          'counts': [{
            "$group": {
              "_id": null,
              "totalCount": {
                "$sum": 1
              },
              "drm_steam_count": {
                "$sum": {
                  "$cond": ["$drm.steam", 1, 0]
                }
              },
              "drm_uplay_count": {
                "$sum": {
                  "$cond": ["$drm.uplay", 1, 0]
                }
              },
              "drm_origin_count": {
                "$sum": {
                  "$cond": ["$drm.origin", 1, 0]
                }
              },
              "drm_rockstar_count": {
                "$sum": {
                  "$cond": ["$drm.rockstar", 1, 0]
                }
              },
              "drm_epicgames_count": {
                "$sum": {
                  "$cond": ["$drm.epicgames", 1, 0]
                }
              },
              "drm_drmfree_count": {
                "$sum": {
                  "$cond": ["$drm.drm_free", 1, 0]
                }
              },
              "drm_bethesda_count": {
                "$sum": {
                  "$cond": ["$drm.bethesda", 1, 0]
                }
              },
              "drm_gog_count": {
                "$sum": {
                  "$cond": ["$drm.gog", 1, 0]
                }
              },
              "platforms_windows_count": {
                "$sum": {
                  "$cond": ["$platforms.windows", 1, 0]
                }
              },
              "platforms_linux_count": {
                "$sum": {
                  "$cond": ["$platforms.linux", 1, 0]
                }
              },
              "platforms_mac_count": {
                "$sum": {
                  "$cond": ["$platforms.mac", 1, 0]
                }
              },
            }
          }]
        }
      },
    ])
    res.send({
      products: result[0].products,
      counts: result[0].counts[0]
    })
  } catch (error) {
    next(error)
  }
}

export const getProductBySlug = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const product = await Product.findOne({ slug }).populate('reviews');
    res.send(product)
  } catch (error) {
    next(error)
  }
}

export const listBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find().limit(8);
    res.send(products)
  } catch (error) {
    next(error)
  }
}

export const getHighlightedProduct = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const slug = tag === 'coming-soon' ? 'dying-light-enhanced-edition' : 'just-cause-3-xxl-edition'
    const product = await Product.findOne({ slug })

    res.send(product)
  } catch (error) {
    next(error)
  }
}

const prod = [
  {
    "_id": "60f91f26e5364e1c8390a556",
    "ztormId": 64131,
    "__v": 21,
    "age": {
      "ACB": 0,
      "USK": 0,
      "PEGI": 0,
      "ESRB": 6
    },
    "availability": {
      "valid_until": null,
      "valid_from": "2021-07-21T23:00:00.000Z"
    },
    "bundles": [],
    "cover": "14c5cd83-9e3a-4d50-8e51-e9007e04599d.jpeg",
    "developers": [
      "Codemasters"
    ],
    "download_date": "2021-07-15T16:00:00.000Z",
    "draft": false,
    "drm": {
      "drm_free": false,
      "steam": true,
      "origin": false,
      "uplay": false
    },
    "genres": [
      "racing",
      "simulator",
      "sport"
    ],
    "lang": [
      "English"
    ],
    "name": "F1® 2021",
    "notice": {
      "legal": "INTERNET CONNECTION & ALL GAME UPDATES REQUIRED TO ACCESS THE FINAL F1® TEAMS’ 2021 CARS, CERTAIN CIRCUITS, CONTENT (AS APPLICABLE) AND F2™ 2021 SEASON UPDATE. SEE www.formula1game.com/2021 FOR DETAILS & AVAILABILITY OF THREE NEW CIRCUITS: PORTIMÃO, IMOLA AND JEDDAH. INTERNET CONNECTION, STEAM ACCOUNT, ACCEPTANCE OF EA USER AGREEMENT (terms.ea.com) REQUIRED TO PLAY. EA’S PRIVACY & COOKIE POLICY APPLIES TO YOUR USE OF EA’S SERVICES. CONTENT UPDATES MAY BE DOWNLOADED AUTOMATICALLY, REQUIRE ADDITIONAL STORAGE, AND INCUR BANDWIDTH USAGE FEES. EA MAY PROVIDE CERTAIN FREE INCREMENTAL CONTENT &/OR UPDATES. EA MAY RETIRE ONLINE FEATURES AFTER 30 DAYS NOTICE POSTED ON ea.com/service-updates.EA User Agreement: terms.ea.com/de for German residents and terms.ea.com for all other residentsEA Privacy & Cookie Policy: privacy.ea.com/de for German residents and privacy.ea.com for all other residentsF1® 2021 Game - an official product of the FIA FORMULA ONE WORLD CHAMPIONSHIP. © 2021 Electronic Arts Inc. The F1 logo, F1, FORMULA 1 and related marks are trade marks of Formula One Licensing BV, a Formula 1 company. Licensed by Formula One World Championship Limited. The F2 FIA FORMULA 2 CHAMPIONSHIP logo, FORMULA 2, F2 and related marks are trade marks of the Federation Internationale de l’Automobile and used exclusively under licence. All rights reserved."
    },
    "order_date": "2021-07-15T16:00:00.000Z",
    "origin_ska": false,
    "platform_specs": {
      "win": {
        "rec": "<p>Steam account is required for game activation and installation.</p><p>Windows Requirements</p><p><strong>Minimum:</strong></p><ul><li>Requires a 64-bit processor and operating system</li><li><strong>OS:</strong> Windows 10 64-bit (Version 1709) | For Ray Tracing: Windows 10 64-bit (Version 2004)</li><li><strong>Processor:</strong> Intel Core i3-2130 or AMD FX 4300</li><li><strong>Memory:</strong> 8 GB RAM</li><li><strong>Graphics:</strong> NVIDIA GTX 950 or AMD R9 280 | For Ray Tracing: GeForce RTX 2060 or Radeon RX 6700 XT</li><li><strong>DirectX:</strong> Version 12</li><li><strong>Storage:</strong> 80 GB available space</li><li><strong>Sound Card:</strong> DirectX Compatible</li></ul><p><strong>Recommended:</strong></p><ul><li>Requires a 64-bit processor and operating system</li><li><strong>OS:</strong> Windows 10 64-bit (Version 1709) | For Ray Tracing: Windows 10 64-bit (Version 2004)</li><li><strong>Processor:</strong> Intel Core i5 9600K or AMD Ryzen 5 2600X</li><li><strong>Memory:</strong> 16 GB RAM</li><li><strong>Graphics:</strong> NVIDIA GTX 1660 Ti or AMD RX 590 | For Ray Tracing: GeForce RTX 3070 or Radeon RX 6800</li><li><strong>DirectX:</strong> Version 12</li><li><strong>Storage:</strong> 80 GB available space</li><li><strong>Sound Card:</strong> DirectX Compatible</li></ul>"
      }
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 870000,
      "RUB": 535500,
      "AUD": 8995,
      "CAD": 7999,
      "EUR": 5999,
      "USD": 5999,
      "GBP": 4999
    },
    "publishers": [
      "EA"
    ],
    "regions_included": [
      {
        "name": "Unknown (EU)",
        "code": "EU",
        "_id": "6135c4c88283850036ed3480"
      },
      {
        "name": "Åland Islands",
        "code": "AX",
        "_id": "6135c4c88283850036ed347f"
      },
      {
        "name": "Albania",
        "code": "AL",
        "_id": "6135c4c88283850036ed347e"
      },
      {
        "name": "Andorra",
        "code": "AD",
        "_id": "6135c4c88283850036ed347d"
      },
      {
        "name": "Armenia",
        "code": "AM",
        "_id": "6135c4c88283850036ed347c"
      },
      {
        "name": "Aruba",
        "code": "AW",
        "_id": "6135c4c88283850036ed347b"
      },
      {
        "name": "Australia",
        "code": "AU",
        "_id": "6135c4c88283850036ed347a"
      },
      {
        "name": "Austria",
        "code": "AT",
        "_id": "6135c4c88283850036ed3479"
      },
      {
        "name": "Belgium",
        "code": "BE",
        "_id": "6135c4c88283850036ed3478"
      },
      {
        "name": "Bosnia and Herzegovina",
        "code": "BA",
        "_id": "6135c4c88283850036ed3477"
      },
      {
        "name": "British Indian Ocean Territory",
        "code": "IO",
        "_id": "6135c4c88283850036ed3476"
      },
      {
        "name": "Bulgaria",
        "code": "BG",
        "_id": "6135c4c88283850036ed3475"
      },
      {
        "name": "Canada",
        "code": "CA",
        "_id": "6135c4c88283850036ed3474"
      },
      {
        "name": "Cayman Islands",
        "code": "KY",
        "_id": "6135c4c88283850036ed3473"
      },
      {
        "name": "Croatia",
        "code": "HR",
        "_id": "6135c4c88283850036ed3472"
      },
      {
        "name": "Cyprus",
        "code": "CY",
        "_id": "6135c4c88283850036ed3471"
      },
      {
        "name": "Czech Republic",
        "code": "CZ",
        "_id": "6135c4c88283850036ed3470"
      },
      {
        "name": "Denmark",
        "code": "DK",
        "_id": "6135c4c88283850036ed346f"
      },
      {
        "name": "Estonia",
        "code": "EE",
        "_id": "6135c4c88283850036ed346e"
      },
      {
        "name": "Faroe Islands",
        "code": "FO",
        "_id": "6135c4c88283850036ed346d"
      },
      {
        "name": "Finland",
        "code": "FI",
        "_id": "6135c4c88283850036ed346c"
      },
      {
        "name": "France",
        "code": "FR",
        "_id": "6135c4c88283850036ed346b"
      },
      {
        "name": "French Guiana",
        "code": "GF",
        "_id": "6135c4c88283850036ed346a"
      },
      {
        "name": "Germany",
        "code": "DE",
        "_id": "6135c4c88283850036ed3469"
      },
      {
        "name": "Greece",
        "code": "GR",
        "_id": "6135c4c88283850036ed3468"
      },
      {
        "name": "Heard Island and McDonald Mcdonald Islands",
        "code": "HM",
        "_id": "6135c4c88283850036ed3467"
      },
      {
        "name": "Holy See (Vatican City State)",
        "code": "VA",
        "_id": "6135c4c88283850036ed3466"
      },
      {
        "name": "Ireland",
        "code": "IE",
        "_id": "6135c4c88283850036ed3464"
      },
      {
        "name": "Isle of Man",
        "code": "IM",
        "_id": "6135c4c88283850036ed3463"
      },
      {
        "name": "Italy",
        "code": "IT",
        "_id": "6135c4c88283850036ed3462"
      },
      {
        "name": "Jersey",
        "code": "JE",
        "_id": "6135c4c88283850036ed3461"
      },
      {
        "name": "Kyrgyzstan",
        "code": "KG",
        "_id": "6135c4c88283850036ed3460"
      },
      {
        "name": "Latvia",
        "code": "LV",
        "_id": "6135c4c88283850036ed345f"
      },
      {
        "name": "Liechtenstein",
        "code": "LI",
        "_id": "6135c4c88283850036ed345e"
      },
      {
        "name": "Lithuania",
        "code": "LT",
        "_id": "6135c4c88283850036ed345d"
      },
      {
        "name": "Luxembourg",
        "code": "LU",
        "_id": "6135c4c88283850036ed345c"
      },
      {
        "name": "Malta",
        "code": "MT",
        "_id": "6135c4c88283850036ed345b"
      },
      {
        "name": "Monaco",
        "code": "MC",
        "_id": "6135c4c88283850036ed345a"
      },
      {
        "name": "Montenegro",
        "code": "ME",
        "_id": "6135c4c88283850036ed3459"
      },
      {
        "name": "Netherlands",
        "code": "NL",
        "_id": "6135c4c88283850036ed3458"
      },
      {
        "name": "Norfolk Island",
        "code": "NF",
        "_id": "6135c4c88283850036ed3457"
      },
      {
        "name": "Norway",
        "code": "NO",
        "_id": "6135c4c88283850036ed3456"
      },
      {
        "name": "Poland",
        "code": "PL",
        "_id": "6135c4c88283850036ed3455"
      },
      {
        "name": "Portugal",
        "code": "PT",
        "_id": "6135c4c88283850036ed3454"
      },
      {
        "name": "Romania",
        "code": "RO",
        "_id": "6135c4c88283850036ed3453"
      },
      {
        "name": "Saint Barthélemy",
        "code": "BL",
        "_id": "6135c4c88283850036ed3452"
      },
      {
        "name": "San Marino",
        "code": "SM",
        "_id": "6135c4c88283850036ed3451"
      },
      {
        "name": "Serbia",
        "code": "RS",
        "_id": "6135c4c88283850036ed3450"
      },
      {
        "name": "Slovakia",
        "code": "SK",
        "_id": "6135c4c88283850036ed344f"
      },
      {
        "name": "Slovenia",
        "code": "SI",
        "_id": "6135c4c88283850036ed344e"
      },
      {
        "name": "Spain",
        "code": "ES",
        "_id": "6135c4c88283850036ed344d"
      },
      {
        "name": "Sweden",
        "code": "SE",
        "_id": "6135c4c88283850036ed344c"
      },
      {
        "name": "Tajikistan",
        "code": "TJ",
        "_id": "6135c4c88283850036ed344b"
      },
      {
        "name": "Trinidad and Tobago",
        "code": "TT",
        "_id": "6135c4c88283850036ed344a"
      },
      {
        "name": "Turks and Caicos Islands",
        "code": "TC",
        "_id": "6135c4c88283850036ed3449"
      },
      {
        "name": "United Kingdom",
        "code": "GB",
        "_id": "6135c4c88283850036ed3448"
      },
      {
        "name": "United States",
        "code": "US",
        "_id": "6135c4c88283850036ed3447"
      },
      {
        "name": "Uzbekistan",
        "code": "UZ",
        "_id": "6135c4c88283850036ed3446"
      },
      {
        "name": "Virgin Islands, British",
        "code": "VG",
        "_id": "6135c4c88283850036ed3445"
      },
      {
        "name": "Virgin Islands, U.S.",
        "code": "VI",
        "_id": "6135c4c88283850036ed3444"
      }
    ],
    "release": "2021-07-15T16:00:00.000Z",
    "seo": {
      "desc": "Every story has a beginning in F1® 2021, the official videogame of the 2021 FIA FORMULA ONE WORLD CHAMPIONSHIP™. Enjoy the stunning new features of F1® 2021, including the thrilling story experience ‘Braking Point’, two-player Career, and get even closer to the grid with ‘Real-Season Start’.",
      "title": null
    },
    "slug": "f-1-2021",
    "steam": {
      "release": "2021-07-15T16:00:00.000Z"
    },
    "type": "game",
    "visible": {
      "valid_until": null,
      "valid_from": "2021-07-21T23:00:00.000Z"
    },
    "ztorm_status": "Active",
    "artists": [],
    "authors": [],
    "collections": [],
    "display_type": "game",
    "features": [],
    "franchises": [
      "F1"
    ],
    "free_redeem_code": null,
    "img": [
      {
        "order": "99",
        "slug": "0db704c4-0242-4fa0-830c-d7f9f36007c3.jpeg",
        "alt": "744621"
      },
      {
        "order": "99",
        "slug": "78003a5f-042c-46aa-bedf-35b36f86ef56.jpeg",
        "alt": "744624"
      },
      {
        "order": "99",
        "slug": "7a2f1585-5908-44db-8cf8-3cde207fe375.jpeg",
        "alt": "744627"
      },
      {
        "order": "99",
        "slug": "0452140e-1202-413f-a251-5e57165f29ad.jpeg",
        "alt": "744630"
      },
      {
        "order": "99",
        "slug": "b90e246a-19bc-48a5-8530-beb0181e47a3.jpeg",
        "alt": "744633"
      },
      {
        "order": "99",
        "slug": "f31380cd-24a6-43ef-9d7a-e5683af1a9ef.jpeg",
        "alt": "744636"
      },
      {
        "order": "99",
        "slug": "5232a7a6-758e-42f1-9ad6-cc5974099591.jpeg",
        "alt": "744639"
      },
      {
        "order": "99",
        "slug": "85112e5a-195d-48ce-87fa-8da2d21d9cce.jpeg",
        "alt": "744642"
      },
      {
        "order": "99",
        "slug": "13def0de-11b1-4d5e-a9ee-1c9471a6c3a6.jpeg",
        "alt": "753297"
      },
      {
        "order": "99",
        "slug": "9bb050be-1994-4154-a0e8-cf88303d53ab.jpeg",
        "alt": "753300"
      },
      {
        "order": "99",
        "slug": "a94a1159-559e-4701-a943-f4e1ec364fce.jpeg",
        "alt": "753303"
      },
      {
        "order": "99",
        "slug": "a349e2fb-9ae6-45f8-b1de-32f333ca44fe.jpeg",
        "alt": "753306"
      },
      {
        "order": "99",
        "slug": "59a4e9c6-7432-4d23-8ae0-67a7c68e5c6a.jpeg",
        "alt": "753309"
      },
      {
        "order": "99",
        "slug": "3d8e781b-88e3-49a6-bb50-063eae71865f.jpeg",
        "alt": "753312"
      },
      {
        "slug": "41f7ba8e-85d3-4e41-b669-ca59905c4770.jpeg",
        "alt": "753315"
      }
    ],
    "modes": [],
    "quotes": [],
    "regions_excluded": [],
    "showReview": true,
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "video": [
      "S985xPL9Xn0"
    ],
    "downloads": [],
    "template_type": "standard",
    "regions_lock": true,
    "desc": "<p>Every story has a beginning in F1® 2021, the official videogame of the 2021 FIA FORMULA ONE WORLD CHAMPIONSHIP™. Enjoy the stunning new features of F1® 2021, including the thrilling story experience ‘Braking Point’, two-player Career, and get even closer to the grid with ‘Real-Season Start’. Take your team to the top in the acclaimed ten-year ‘My Team’ Career mode, or race head-to-head in split-screen and multiplayer. Immerse yourself in the greatest racing spectacle on the planet and race with the authentic lineup of twenty heroic drivers and ten iconic teams from the 2021 season:</p><ul><li>‘Braking Point’ – the thrilling new story experience</li><li>New ways to play: two-player Career and ‘Real-Season Start’</li><li>Acclaimed ‘My Team’, split-screen and multiplayer</li></ul><p><strong>THE OFFICIAL VIDEOGAME OF THE 2021 FORMULA ONE WORLD CHAMPIONSHIP™ </strong></p><ul><li>Braking Point’ – the thrilling new story experience.</li><li>New ways to play: two-player Career and ‘Real-Season Start’.</li><li>My Team mode - create a driver, choose a sponsor, an engine supplier, hire a teammate and compete as the 11th team on the grid.</li><li>Expanded Driver Stats that now include ‘Focus’ and new team-critical Department Events to address.</li><li>Split-screen racing for two players.</li><li>Casual race options for more relaxed racing whilst new Expert options give experienced players even more control.</li><li>Acclaimed ten-year Career Mode, including updated Research and Development and Practice Programmes, and new Quick Practice.</li><li>Formula 2™, the ultimate training ground for F1®, is also included, with short, medium, or full season options and 2020 and 2021 season content *.</li><li>Esports - in-game area for the online qualification events, latest news and even watch the new F1® Esports Challenger and Pro Series races.</li><li>More ways to race: Time Trial, Shorter season length options, Grand Prix™ Mode and relive your glory with saveable automated highlights and (PC only) full replays.</li><li>Compete online in Multiplayer: Social and Ranked races, new Quick Join format, Leagues, customisable liveries, and Weekly Events.</li></ul><p><strong><em><u>* Online connection required to download the final F1® teams’ 2021 cars, full season circuit selection, content (as applicable) and F2™ 2021 season update.\"</u></em></strong></p>",
    "hitcardVideo": "8yD94YvOo1H5ZOPygvo6fMo9YxXQp-480p.mp4",
    "supplier_id": "5efb51f769fcc4007ea79ad0",
    "currentPrice": {
      "JPY": 765600,
      "RUB": 471240,
      "AUD": 7915,
      "CAD": 7039,
      "EUR": 5279,
      "USD": 5279,
      "GBP": 4399
    },
    "current_discount": {
      "percent": 0.12,
      "display_percentage": true,
      "until": "2021-09-21T15:59:00.000Z",
      "from": "2021-09-19T07:01:00.464Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": true,
      "highlighted": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "bundles": [],
        "cover": "14c5cd83-9e3a-4d50-8e51-e9007e04599d.jpeg",
        "drm": {
          "drm_free": false,
          "steam": true,
          "origin": false,
          "uplay": false
        },
        "name": "F1® 2021",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 870000,
          "RUB": 535500,
          "AUD": 8995,
          "CAD": 7999,
          "EUR": 5999,
          "USD": 5999,
          "GBP": 4999
        },
        "slug": "f-1-2021",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 765600,
          "RUB": 471240,
          "AUD": 7915,
          "CAD": 7039,
          "EUR": 5279,
          "USD": 5279,
          "GBP": 4399
        },
        "current_discount": {
          "percent": 0.12,
          "display_percentage": true,
          "until": "2021-09-21T15:59:00.000Z",
          "from": "2021-09-19T07:01:00.464Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Standard Edition"
      },
      {
        "bundles": [],
        "cover": "96f9e727-6bef-4542-b226-e6c92788089e.jpeg",
        "drm": {
          "drm_free": false,
          "steam": true,
          "origin": false,
          "uplay": false
        },
        "name": "F1® 2021 Deluxe Edition",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "GBP": 6499,
          "USD": 7499,
          "EUR": 7499,
          "CAD": 9499,
          "AUD": 10495,
          "RUB": 669400,
          "JPY": 1020000
        },
        "slug": "f-1-2021-deluxe-edition",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "GBP": 5719,
          "USD": 6599,
          "EUR": 6599,
          "CAD": 8359,
          "AUD": 9235,
          "RUB": 589072,
          "JPY": 897600
        },
        "current_discount": {
          "percent": 0.12,
          "display_percentage": true,
          "until": "2021-09-21T15:59:00.000Z",
          "from": "2021-09-19T07:01:00.464Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Deluxe Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "edition_name": "Standard Edition",
    "recommendations": [
      "wrc-10-fia-world-rally-championship",
      "team-sonic-racing",
      "e-football-pes-2021",
      "e-football-pes-2021-season-update-arsenal-edition",
      "e-football-pes-2021-season-update-juventus-edition",
      "e-football-pes-2021-season-update-manchester-united-edition",
      "e-football-pes-2021-season-update-fc-barcelona-edition",
      "e-football-pes-2021-season-update-fc-bayern-munchen-edition",
      "project-cars-game-of-the-year-edition",
      "project-cars-2-deluxe-edition-game",
      "sonic-all-stars-racing-transformed",
      "cycling-bundle-2021",
      "assetto-corsa-dream-pack-1",
      "football-manager-2021",
      "motorsport-manager-challenge-pack"
    ],
    "recommendations_challenger": [
      "f-1-2021-deluxe-edition",
      "wrc-10-fia-world-rally-championship",
      "team-sonic-racing",
      "e-football-pes-2021",
      "e-football-pes-2021-season-update-arsenal-edition",
      "e-football-pes-2021-season-update-juventus-edition",
      "e-football-pes-2021-season-update-manchester-united-edition",
      "e-football-pes-2021-season-update-fc-barcelona-edition",
      "e-football-pes-2021-season-update-fc-bayern-munchen-edition",
      "project-cars-game-of-the-year-edition",
      "project-cars-2-deluxe-edition-game",
      "sonic-all-stars-racing-transformed",
      "cycling-bundle-2021",
      "assetto-corsa-dream-pack-1",
      "football-manager-2021"
    ],
    "videos": [
      {
        "id": "yXnGt0DaCds",
        "title": "WEATHER CHANGES INSTANTLY MID-RACE! BIG GLITCH F1 2021 GAME!",
        "date": "2021-09-17T18:00:32Z",
        "thumbnail_url": "https://i.ytimg.com/vi/yXnGt0DaCds/hqdefault.jpg"
      },
      {
        "id": "PL7cYxuLjCk",
        "title": "Can You Beat 0% AI WITHOUT BRAKING on the F1 2021 Game?!",
        "date": "2021-08-15T17:27:46Z",
        "thumbnail_url": "https://i.ytimg.com/vi/PL7cYxuLjCk/hqdefault.jpg"
      },
      {
        "id": "ap1K2LHOKHg",
        "title": "5 THINGS THAT NEED TO BE FIXED IN THE F1 2021 GAME &amp; MY TEAM CAREER MODE!",
        "date": "2021-08-02T14:00:03Z",
        "thumbnail_url": "https://i.ytimg.com/vi/ap1K2LHOKHg/hqdefault.jpg"
      },
      {
        "id": "7WRrCJRSlDo",
        "title": "The Belgian Grand Prix but there&#39;s NO GRIP! | F1 2021 Game Experiment 0% Grip",
        "date": "2021-08-28T17:00:03Z",
        "thumbnail_url": "https://i.ytimg.com/vi/7WRrCJRSlDo/hqdefault.jpg"
      },
      {
        "id": "d3dXasXxPII",
        "title": "F1 2021 REALISTIC CRASHES #15",
        "date": "2021-09-14T13:30:13Z",
        "thumbnail_url": "https://i.ytimg.com/vi/d3dXasXxPII/hqdefault.jpg"
      },
      {
        "id": "NuWvyd9Fx-U",
        "title": "WHAT HAPPENS WHEN YOU HAVE NO MONEY IN F1 2021 MY TEAM CAREER MODE? | F1 2021 Game Experiment",
        "date": "2021-08-18T16:24:30Z",
        "thumbnail_url": "https://i.ytimg.com/vi/NuWvyd9Fx-U/hqdefault.jpg"
      },
      {
        "id": "I2mDQhnyBSM",
        "title": "100% ENGINE WEAR IN F1 2021 MY TEAM CAREER MODE! SAFETY CAR TAKES OUT 14 CARS!",
        "date": "2021-08-19T18:00:32Z",
        "thumbnail_url": "https://i.ytimg.com/vi/I2mDQhnyBSM/hqdefault.jpg"
      },
      {
        "id": "XGLv1B6oXDU",
        "title": "HOW QUICKLY CAN YOU GET A MAXED OUT CAR IN F1 2021 MY TEAM CAREER MODE?! $1 BILLION &amp; R&amp;D POINTS!",
        "date": "2021-09-08T17:34:48Z",
        "thumbnail_url": "https://i.ytimg.com/vi/XGLv1B6oXDU/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "YPl-qBAAACIAV6f7",
        "uid": "5-things-f1-2021-got-right-review-pc-xbox-playstation",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YPl-qBAAACIAV6f7%22%29+%5D%5D",
        "tags": [
          "5 Things",
          "What it got right",
          "Review"
        ],
        "first_publication_date": "2021-07-23T14:13:54+0000",
        "last_publication_date": "2021-07-26T14:45:15+0000",
        "slugs": [
          "5-things-f1-2021-got-right---our-review"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-07-23T14:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "5 things F1 2021 got right - Our review",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/36f1c665-e8c0-4c29-814f-95287b678478_f1pic02.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/36f1c665-e8c0-4c29-814f-95287b678478_f1pic02.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/36f1c665-e8c0-4c29-814f-95287b678478_f1pic02.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/36f1c665-e8c0-4c29-814f-95287b678478_f1pic02.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Our take on Codemasters latest racing sim in the formidable Formula 1 series",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "YO7dSxAAACMAaUpQ",
        "uid": "f1-2021-deluxe-edition-steam-pc-whats-included",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YO7dSxAAACMAaUpQ%22%29+%5D%5D",
        "tags": [
          "What's Included",
          "Deluxe Edition",
          "Steam PC",
          "Esports "
        ],
        "first_publication_date": "2021-07-14T15:54:04+0000",
        "last_publication_date": "2021-07-15T13:13:21+0000",
        "slugs": [
          "f1-2021-deluxe-edition---whats-included"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-07-14T15:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "F1 2021 Deluxe Edition - What's included",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/c9469bdd-0c7a-4590-93bf-58e674455edf_f121.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/c9469bdd-0c7a-4590-93bf-58e674455edf_f121.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/c9469bdd-0c7a-4590-93bf-58e674455edf_f121.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/c9469bdd-0c7a-4590-93bf-58e674455edf_f121.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Lead the pack in high-octane action with this jam-packed edition of Codemasters and EA's racing sim",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {
      "rating_score": 5,
      "total_ratings": 2,
      "percent_recommended": 100,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 0,
        "four_star_percentage": 0,
        "five_star_percentage": 100
      },
      "reviewLocales": [],
      "total_written_reviews": 0
    },
    "streams": [
      {
        "id": "43766888285",
        "user_name": "Alpi_27",
        "type": "live",
        "title": "(Ps4/5/18+)Neue Alerts und einen guten Start in die neue Woche !Instagram !Youtube ",
        "started_at": "2021-09-20T06:34:55Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_alpi_27-{width}x{height}.jpg"
      },
      {
        "id": "43767028461",
        "user_name": "dromsy_",
        "type": "live",
        "title": "[GER][Racing Time] Mit Kevin auf Tour \\o/ BS:20/30 (dromsy.de)",
        "started_at": "2021-09-20T07:01:05Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_dromsy_-{width}x{height}.jpg"
      },
      {
        "id": "39990373531",
        "user_name": "Mephisto1339",
        "type": "live",
        "title": "[PS4] Einen guten Start in die neue Woche euch allen | daddelheim.de !giveaway !sa !rewe !augenringe !zocken ",
        "started_at": "2021-09-20T08:06:11Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_mephisto1339-{width}x{height}.jpg"
      },
      {
        "id": "43767445901",
        "user_name": "PL4NES",
        "type": "live",
        "title": "Open lobby degenerate does open lobby things",
        "started_at": "2021-09-20T08:26:22Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_pl4nes-{width}x{height}.jpg"
      },
      {
        "id": "43312861900",
        "user_name": "Balinko4",
        "type": "live",
        "title": "Balinkozpin na Russia! F1 no chill",
        "started_at": "2021-09-20T08:18:00Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_balinko4-{width}x{height}.jpg"
      },
      {
        "id": "43767417533",
        "user_name": "Foxxy_RL",
        "type": "live",
        "title": "[OCE] I race and do other things. ",
        "started_at": "2021-09-20T08:20:10Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_foxxy_rl-{width}x{height}.jpg"
      },
      {
        "id": "43312888060",
        "user_name": "crazyy_m1nd",
        "type": "live",
        "title": "Neuer Channel - Spontaner Stream",
        "started_at": "2021-09-20T08:28:47Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_crazyy_m1nd-{width}x{height}.jpg"
      },
      {
        "id": "43767477965",
        "user_name": "Pjeter",
        "type": "live",
        "title": "Maar waarom?",
        "started_at": "2021-09-20T08:33:20Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_pjeter-{width}x{height}.jpg"
      }
    ]
  },
  {
    "_id": "6115073de0dc58007d27cd73",
    "__v": 11,
    "age": {
      "ESRB": 0,
      "PEGI": 0,
      "USK": 0,
      "ACB": 0
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_until": null,
      "valid_from": "2021-08-17T14:00:00.000Z"
    },
    "bundles": [],
    "catalina": false,
    "collections": [],
    "cover": "d29c142e-304f-4186-b6dc-6cce00a30740.jpeg",
    "developers": [
      "AMPLITUDE Studios"
    ],
    "display_type": "game",
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "features": [
      "PvP",
      "Online PvP",
      "Steam Achievements",
      "Steam Workshop"
    ],
    "franchises": [
      "HUMANKIND"
    ],
    "free_redeem_code": null,
    "genres": [
      "Strategy"
    ],
    "img": [
      {
        "alt": "Battle",
        "slug": "afe17847-0d72-412a-aa36-55e123a15d16.jpeg",
        "order": "99"
      },
      {
        "alt": "City",
        "slug": "275fb83e-67b3-4488-bffb-7bca50fe5f99.jpeg",
        "order": "99"
      },
      {
        "alt": "Civics",
        "slug": "506c9b22-ccec-4bdc-ae36-8028035ff398.jpeg",
        "order": "99"
      },
      {
        "alt": "Cultures",
        "slug": "4d46955c-f669-4060-b37b-7c33f2255a8c.jpeg",
        "order": "99"
      },
      {
        "alt": "Diplomacy",
        "slug": "7960e25c-6921-4f4d-8562-b5d1d441f7fc.jpeg",
        "order": "99"
      },
      {
        "alt": "Exploration",
        "slug": "686b4b92-2a89-4ef4-a6ce-c7e1d1bcb2c6.jpeg",
        "order": "99"
      },
      {
        "alt": "Fame",
        "slug": "22e7d721-7e0c-467b-a87c-927e205328d3.jpeg",
        "order": "99"
      },
      {
        "alt": "Influence",
        "slug": "def0704c-e024-4015-a094-aa32154e47cc.jpeg",
        "order": "99"
      },
      {
        "alt": "Narrative Event",
        "slug": "e6a90ab6-13f5-438a-9167-1280778d145a.jpeg",
        "order": "99"
      },
      {
        "alt": "Naval Exploration",
        "slug": "0feded3c-eb66-401a-adde-901b8a3d8832.jpeg",
        "order": "99"
      },
      {
        "alt": "Outpost and Regions",
        "slug": "04cc1511-989d-4f89-802d-a8fceab81c5a.jpeg",
        "order": "99"
      },
      {
        "alt": "Religion",
        "slug": "8be43e89-c9e7-4c3b-b238-1de5425ee9ca.jpeg",
        "order": "99"
      },
      {
        "alt": "Siege Battle",
        "slug": "c83988f4-d18b-47c5-867d-ccf7ad94dca3.jpeg",
        "order": "99"
      },
      {
        "alt": "Technologies",
        "slug": "0c77bbdd-33e8-4bed-bd05-75da77c558e0.jpeg",
        "order": "99"
      },
      {
        "alt": "Trade",
        "slug": "978c0e3d-e4a7-40d8-b779-aac9bcd20183.jpeg"
      }
    ],
    "lang": [
      "English",
      "French",
      "German",
      "Spanish - Spain",
      "Polish",
      "Russian",
      "Simplified Chinese",
      "Traditional Chinese",
      "Portuguese - Brazil",
      "Korean"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer"
    ],
    "name": "HUMANKIND",
    "notice": {
      "legal": "©SEGA. All rights reserved. HUMANKIND, the HUMANKIND logo, SEGA and the SEGA logo are either registered trademarks or trademarks of SEGA Holdings Co., Ltd. or its affiliates. SEGA is registered in the U.S. Patent and Trademark Office. GAMES2GETHER, Amplitude Studios and the Amplitude Studios logo are either registered trademarks or trademarks of Amplitude Studios SAS. All other trademarks, logos and copyrights are property of their respective owners."
    },
    "platform_specs": {
      "win": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows 7, 64-bit<br></li><li><strong>Processor:</strong> Intel i5 4th generation / AMD FX-8300<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> NVIDIA GTX 770 / AMD R9 290<br></li><li><strong>DirectX:</strong> Version 11<br></li><li><strong>Storage:</strong> 25 GB available space</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows 7, 64-bit<br></li><li><strong>Processor:</strong> Intel i5 6th generation (or better) / AMD Ryzen 5 1600 (or better)<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> NVIDIA GTX 1060 (or better) / AMD RX 5500-XT (or better)<br></li><li><strong>DirectX:</strong> Version 11<br></li><li><strong>Storage:</strong> 25 GB available space</li></ul>"
      },
      "mac": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Mac OS X 10.12 or higher<br></li><li><strong>Processor:</strong> Intel Core i7 2.7Ghz<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> AMD Radeon460 4GB or Intel(R) Iris(TM) Plus Graphics<br></li><li><strong>Storage:</strong> 25 GB available space</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system</li></ul>"
      }
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 607300,
      "RUB": 433400,
      "AUD": 6999,
      "CAD": 6499,
      "EUR": 4999,
      "USD": 4999,
      "GBP": 3999
    },
    "publishers": [
      "SEGA"
    ],
    "quotes": [],
    "regions_excluded": [],
    "regions_included": [
      {
        "name": "Albania",
        "code": "AL",
        "_id": "611a2f9b7c41bb007d81b064"
      },
      {
        "name": "Andorra",
        "code": "AD",
        "_id": "611a2f9b7c41bb007d81b063"
      },
      {
        "name": "Austria",
        "code": "AT",
        "_id": "611a2f9b7c41bb007d81b062"
      },
      {
        "name": "Belgium",
        "code": "BE",
        "_id": "611a2f9b7c41bb007d81b061"
      },
      {
        "name": "Bosnia and Herzegovina",
        "code": "BA",
        "_id": "611a2f9b7c41bb007d81b060"
      },
      {
        "name": "Bulgaria",
        "code": "BG",
        "_id": "611a2f9b7c41bb007d81b05f"
      },
      {
        "name": "Croatia",
        "code": "HR",
        "_id": "611a2f9b7c41bb007d81b05e"
      },
      {
        "name": "Cyprus",
        "code": "CY",
        "_id": "611a2f9b7c41bb007d81b05d"
      },
      {
        "name": "Czech Republic",
        "code": "CZ",
        "_id": "611a2f9b7c41bb007d81b05c"
      },
      {
        "name": "Denmark",
        "code": "DK",
        "_id": "611a2f9b7c41bb007d81b05b"
      },
      {
        "name": "Estonia",
        "code": "EE",
        "_id": "611a2f9b7c41bb007d81b05a"
      },
      {
        "name": "Falkland Islands (Malvinas)",
        "code": "FK",
        "_id": "611a2f9b7c41bb007d81b059"
      },
      {
        "name": "Faroe Islands",
        "code": "FO",
        "_id": "611a2f9b7c41bb007d81b058"
      },
      {
        "name": "Finland",
        "code": "FI",
        "_id": "611a2f9b7c41bb007d81b057"
      },
      {
        "name": "France",
        "code": "FR",
        "_id": "611a2f9b7c41bb007d81b056"
      },
      {
        "name": "French Guiana",
        "code": "GF",
        "_id": "611a2f9b7c41bb007d81b055"
      },
      {
        "name": "French Polynesia",
        "code": "PF",
        "_id": "611a2f9b7c41bb007d81b054"
      },
      {
        "name": "Germany",
        "code": "DE",
        "_id": "611a2f9b7c41bb007d81b053"
      },
      {
        "name": "Gibraltar",
        "code": "GI",
        "_id": "611a2f9b7c41bb007d81b052"
      },
      {
        "name": "Greece",
        "code": "GR",
        "_id": "611a2f9b7c41bb007d81b051"
      },
      {
        "name": "Greenland",
        "code": "GL",
        "_id": "611a2f9b7c41bb007d81b050"
      },
      {
        "name": "Guadeloupe",
        "code": "GP",
        "_id": "611a2f9b7c41bb007d81b04f"
      },
      {
        "name": "Guernsey",
        "code": "GG",
        "_id": "611a2f9b7c41bb007d81b04e"
      },
      {
        "name": "Holy See (Vatican City State)",
        "code": "VA",
        "_id": "611a2f9b7c41bb007d81b04d"
      },
      {
        "name": "Hungary",
        "code": "HU",
        "_id": "611a2f9b7c41bb007d81b04c"
      },
      {
        "name": "Iceland",
        "code": "IS",
        "_id": "611a2f9b7c41bb007d81b04b"
      },
      {
        "name": "Ireland",
        "code": "IE",
        "_id": "611a2f9b7c41bb007d81b04a"
      },
      {
        "name": "Isle of Man",
        "code": "IM",
        "_id": "611a2f9b7c41bb007d81b049"
      },
      {
        "name": "Italy",
        "code": "IT",
        "_id": "611a2f9b7c41bb007d81b048"
      },
      {
        "name": "Jersey",
        "code": "JE",
        "_id": "611a2f9b7c41bb007d81b047"
      },
      {
        "name": "Latvia",
        "code": "LV",
        "_id": "611a2f9b7c41bb007d81b046"
      },
      {
        "name": "Liechtenstein",
        "code": "LI",
        "_id": "611a2f9b7c41bb007d81b045"
      },
      {
        "name": "Lithuania",
        "code": "LT",
        "_id": "611a2f9b7c41bb007d81b044"
      },
      {
        "name": "Luxembourg",
        "code": "LU",
        "_id": "611a2f9b7c41bb007d81b043"
      },
      {
        "name": "Macedonia, the Former Yugoslav Republic of",
        "code": "MK",
        "_id": "611a2f9b7c41bb007d81b042"
      },
      {
        "name": "Malta",
        "code": "MT",
        "_id": "611a2f9b7c41bb007d81b041"
      },
      {
        "name": "Martinique",
        "code": "MQ",
        "_id": "611a2f9b7c41bb007d81b040"
      },
      {
        "name": "Mayotte",
        "code": "YT",
        "_id": "611a2f9b7c41bb007d81b03f"
      },
      {
        "name": "Monaco",
        "code": "MC",
        "_id": "611a2f9b7c41bb007d81b03e"
      },
      {
        "name": "Montenegro",
        "code": "ME",
        "_id": "611a2f9b7c41bb007d81b03d"
      },
      {
        "name": "Netherlands",
        "code": "NL",
        "_id": "611a2f9b7c41bb007d81b03c"
      },
      {
        "name": "New Caledonia",
        "code": "NC",
        "_id": "611a2f9b7c41bb007d81b03b"
      },
      {
        "name": "Norway",
        "code": "NO",
        "_id": "611a2f9b7c41bb007d81b03a"
      },
      {
        "name": "Poland",
        "code": "PL",
        "_id": "611a2f9b7c41bb007d81b039"
      },
      {
        "name": "Portugal",
        "code": "PT",
        "_id": "611a2f9b7c41bb007d81b038"
      },
      {
        "name": "Romania",
        "code": "RO",
        "_id": "611a2f9b7c41bb007d81b037"
      },
      {
        "name": "Saint Martin (French part)",
        "code": "MF",
        "_id": "611a2f9b7c41bb007d81b036"
      },
      {
        "name": "San Marino",
        "code": "SM",
        "_id": "611a2f9b7c41bb007d81b035"
      },
      {
        "name": "Serbia",
        "code": "RS",
        "_id": "611a2f9b7c41bb007d81b034"
      },
      {
        "name": "Slovakia",
        "code": "SK",
        "_id": "611a2f9b7c41bb007d81b033"
      },
      {
        "name": "Slovenia",
        "code": "SI",
        "_id": "611a2f9b7c41bb007d81b032"
      },
      {
        "name": "Spain",
        "code": "ES",
        "_id": "611a2f9b7c41bb007d81b031"
      },
      {
        "name": "Sweden",
        "code": "SE",
        "_id": "611a2f9b7c41bb007d81b030"
      },
      {
        "name": "Switzerland",
        "code": "CH",
        "_id": "611a2f9b7c41bb007d81b02f"
      },
      {
        "name": "United Kingdom",
        "code": "GB",
        "_id": "611a2f9b7c41bb007d81b02e"
      }
    ],
    "release": "2021-08-12T11:34:14.199Z",
    "seo": {
      "desc": "Dare you re-write the entire narrative of human history? It's time to find out with your HUMANKIND Steam PC key. The critically-acclaimed 4X strategy sim from SEGA and Amplitude Studios!",
      "title": null
    },
    "showReview": true,
    "slug": "humankind",
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2021-08-17T14:00:00.000Z",
      "id": null,
      "type": "app"
    },
    "type": "game",
    "url": "http://www.humankind.game",
    "video": [
      "ltYMq70socA",
      "8zHBs_47xuU",
      "NhYOQ_ZQILQ"
    ],
    "visible": {
      "valid_until": null,
      "valid_from": "2021-08-17T14:00:00.000Z"
    },
    "downloads": [],
    "template_type": "standard",
    "desc": "<p>Dare you re-write the entire narrative of human history? It's time to find out with your HUMANKIND Steam PC key. In this historical strategy game, you'll combine cultures to create a civilization that&#8217;s as unique as you are!&#160;</p>&#10;<p><strong>YOUR CIVILIZATION<br/></strong>Combine up to 60 historical cultures as you lead your people from the Ancient to the Modern Age. From humble origins as a Neolithic tribe, transition to the Ancient Era as the Babylonians, become the Classical era Mayans, the Medieval Umayyads, the Early Modern era British, and so on.</p>&#10;<p>Each culture will add its own special gameplay layer, leading to near-endless outcomes.</p>&#10;<p><strong>MORE THAN HISTORY, IT&#8217;S YOUR STORY<br/></strong>Face historical events, take impactful moral decisions, and make scientific breakthroughs. Discover the natural wonders of the world or build the most remarkable creations of humankind.</p>&#10;<p>Each game element is historically authentic, so be sure to combine them to build your own vision of the world.</p>&#10;<p><strong>LEAVE YOUR MARK<br/></strong>The journey matters more than the destination - fame is a new and unifying victory condition. Every great deed you accomplish, every moral choice you make, every battle won will build your fame and leave a lasting impact on the world.</p>&#10;<p>The player with the most fame will win the game. Will you be the one to leave the deepest mark on the world?</p>&#10;<p><strong>TACTICAL BATTLES ON LAND, SEA, AND AIR<br/></strong>Each battle in HUMANKIND plays out like a mini turn-based board game on top of the actual world map. Unstack your armies and command each of your units, including the emblematic units of your culture and their special abilities.</p>&#10;<p>Construct siege weapons to besiege and occupy cities. Fight in large battles spanning multiple turns, and don&#8217;t hesitate to bring in reinforcements!</p>&#10;<p><strong>BE A LEADER<br/></strong>Create and customize the leader of your society, and watch how your avatar evolves visually over the course of the game as your civilization develops. You&#8217;ll also be able to level up your leader via a meta-progression system to unlock custom looks that you can show off to strangers and friends alike in multiplayer matches up to eight players.</p>&#10;<p><strong>YOUR OFFICIAL HUMANKIND STEAM PC KEY INCLUDES:</strong></p>&#10;<ul>&#10;<li>Critically-acclaimed 4X strategy sim.</li>&#10;<li>60 historical cultures to combine and lead.</li>&#10;<li>Customizable tools to design your own leader.</li>&#10;<li>Huge replayability with&#160;near-endless outcomes.</li>&#10;<li>Turn-based elements and multiplayer matches for up to eight players.</li>&#10;</ul>",
    "genba_id": "851e3f13-8a16-4a73-b0d2-b5042ac3ab77",
    "supplier_id": "57874ac557564d0e00eade39",
    "currentPrice": {
      "JPY": 485840,
      "RUB": 346720,
      "AUD": 5599,
      "CAD": 5199,
      "EUR": 3999,
      "USD": 3999,
      "GBP": 3199
    },
    "current_discount": {
      "percent": 0.2,
      "display_percentage": true,
      "until": "2021-09-21T15:59:00.000Z",
      "from": "2021-09-19T07:01:00.464Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": true,
      "highlighted": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "bundles": [],
        "cover": "d29c142e-304f-4186-b6dc-6cce00a30740.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "HUMANKIND",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 607300,
          "RUB": 433400,
          "AUD": 6999,
          "CAD": 6499,
          "EUR": 4999,
          "USD": 4999,
          "GBP": 3999
        },
        "slug": "humankind",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 485840,
          "RUB": 346720,
          "AUD": 5599,
          "CAD": 5199,
          "EUR": 3999,
          "USD": 3999,
          "GBP": 3199
        },
        "current_discount": {
          "percent": 0.2,
          "display_percentage": true,
          "until": "2021-09-21T15:59:00.000Z",
          "from": "2021-09-19T07:01:00.464Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Standard Edition"
      },
      {
        "bundles": [],
        "cover": "bc3a8c55-1aae-49bb-aff5-04561120d9fa.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "HUMANKIND - Digital Deluxe Edition",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 679000,
          "RUB": 520400,
          "AUD": 8999,
          "CAD": 7800,
          "EUR": 5999,
          "USD": 5999,
          "GBP": 4799
        },
        "slug": "humankind-digital-deluxe-edition",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 536410,
          "RUB": 411116,
          "AUD": 7109,
          "CAD": 6162,
          "EUR": 4739,
          "USD": 4739,
          "GBP": 3791
        },
        "current_discount": {
          "percent": 0.21,
          "display_percentage": true,
          "until": "2021-09-24T07:00:00.000Z",
          "from": "2021-09-09T15:01:00.000Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": false,
          "highlighted": true
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Digital Deluxe Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "edition_name": "Standard Edition",
    "recommendations": [
      "endless-legend",
      "thea-the-awakening",
      "sid-meiers-civilization-vi-new-aspyr",
      "sid-meiers-civilization-vi-new",
      "everhood",
      "sid-meiers-civilization-beyond-earth-aspyr",
      "sid-meiers-civilization-v-brave-new-world-aspyr",
      "foxhole",
      "iron-harvest",
      "the-crew-ultimate-edition",
      "a-total-war-saga-troy",
      "snk-40-th-anniversary-collection",
      "total-war-rome-ii-emperor-edition",
      "unrailed",
      "exanima"
    ],
    "recommendations_challenger": [
      "humankind-digital-deluxe-edition",
      "endless-legend",
      "thea-the-awakening",
      "sid-meiers-civilization-vi-new-aspyr",
      "sid-meiers-civilization-vi-new",
      "everhood",
      "sid-meiers-civilization-beyond-earth-aspyr",
      "sid-meiers-civilization-v-brave-new-world-aspyr",
      "foxhole",
      "iron-harvest",
      "the-crew-ultimate-edition",
      "a-total-war-saga-troy",
      "snk-40-th-anniversary-collection",
      "total-war-rome-ii-emperor-edition",
      "unrailed"
    ],
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "PCGamesN",
        "message": "\"The most direct challenger to Civilization yet is full of brilliant ideas which could yet change the genre, although bugs and underdeveloped features occasionally get in the way of the fun.\"",
        "url": "https://www.pcgamesn.com/humankind/review",
        "displayScore": "8 / 10",
        "outletImage": "",
        "author": "Richard Scott-Jones"
      },
      {
        "scoreType": "text",
        "outletName": "IGN",
        "message": "\"Humankind is an interesting but fairly safe riff on historical 4X that doesn't always rise to meet its potential.\"",
        "url": "https://www.ign.com/articles/humankind-review-4x-strategy-game",
        "displayScore": "7 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/ign.jpg",
        "author": "Leana Hafer"
      },
      {
        "scoreType": "stars",
        "outletName": "GamesRadar+",
        "message": "\"Embracing player motivations from start to finish, Humankind refreshes the 4X genre – even with a couple of technical kinks.\"",
        "url": "https://www.gamesradar.com/humankind-review/",
        "displayScore": "4.5 / 5 stars",
        "outletImage": "https://cdn.fanatical.com/production/logos/gameradar.jpg",
        "author": "Ruth Cassidy",
        "starScore": 4.5,
        "outOfStarScore": 5
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/10977/humankind",
    "opencriticScoreString": "80% Strong",
    "opencriticReviewCount": 45,
    "opencriticPercentRecommended": 66,
    "openCriticScore": 80,
    "videos": [
      {
        "id": "TwjHwYSQ_wc",
        "title": "Humankind Late Game Trailer (1080p)",
        "date": "2021-08-17T21:39:14Z",
        "thumbnail_url": "https://i.ytimg.com/vi/TwjHwYSQ_wc/hqdefault.jpg"
      },
      {
        "id": "gfIu6kZ1ClI",
        "title": "Humankind Gameplay (PC Game)",
        "date": "2021-08-17T18:29:44Z",
        "thumbnail_url": "https://i.ytimg.com/vi/gfIu6kZ1ClI/hqdefault.jpg"
      },
      {
        "id": "dc_bNJlJyRA",
        "title": "Humankind Game - Ep 12 - Victory!",
        "date": "2021-09-17T12:30:07Z",
        "thumbnail_url": "https://i.ytimg.com/vi/dc_bNJlJyRA/hqdefault.jpg"
      },
      {
        "id": "VxAWbx1aX8s",
        "title": "Humankind Game - Ep 5",
        "date": "2021-09-03T12:30:05Z",
        "thumbnail_url": "https://i.ytimg.com/vi/VxAWbx1aX8s/hqdefault.jpg"
      },
      {
        "id": "kjtDEeSmZkc",
        "title": "So much fame | Humankind Game #1 Part 4",
        "date": "2021-09-04T06:00:10Z",
        "thumbnail_url": "https://i.ytimg.com/vi/kjtDEeSmZkc/hqdefault.jpg"
      },
      {
        "id": "cQD5g0HhvsU",
        "title": "Grubby plays Humankind - a PC Strategy Game that&#39;s releasing April 2021!",
        "date": "2021-01-12T23:04:53Z",
        "thumbnail_url": "https://i.ytimg.com/vi/cQD5g0HhvsU/hqdefault.jpg"
      },
      {
        "id": "oV9MkFX9D5c",
        "title": "The Huns are here | Humankind Game #1 Part 2",
        "date": "2021-08-28T18:00:08Z",
        "thumbnail_url": "https://i.ytimg.com/vi/oV9MkFX9D5c/hqdefault.jpg"
      },
      {
        "id": "cW8Ziy74b6U",
        "title": "This Game WILL Compete Against CIVILIZATION! Humankind Playthrough PART 1",
        "date": "2021-08-20T16:00:16Z",
        "thumbnail_url": "https://i.ytimg.com/vi/cW8Ziy74b6U/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "YRvKuhEAACEAo72D",
        "uid": "humankind-steam-pc-reviews-what-critics-saying-game",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YRvKuhEAACEAo72D%22%29+%5D%5D",
        "tags": [
          "Reviews",
          "4X",
          "Strategy",
          "what are the critics saying"
        ],
        "first_publication_date": "2021-08-17T16:10:59+0000",
        "last_publication_date": "2021-08-17T16:11:37+0000",
        "slugs": [
          "humankind-reviews---what-are-the-critics-saying-about-the-game"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-08-17T16:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "HUMANKIND reviews - What are the critics saying about the game",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/717d9aa7-4bc6-4a06-88ac-4468081815d1_humankind04.jpg?auto=compress,format&rect=1,0,1918,1079&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/717d9aa7-4bc6-4a06-88ac-4468081815d1_humankind04.jpg?auto=compress,format&rect=0,0,1918,1079&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/717d9aa7-4bc6-4a06-88ac-4468081815d1_humankind04.jpg?auto=compress,format&rect=0,0,1918,1079&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/717d9aa7-4bc6-4a06-88ac-4468081815d1_humankind04.jpg?auto=compress,format&rect=0,0,1918,1079&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "They've spoken... the scores are in for the new 4X strategy",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "YHXBCBEAACYAxmNf",
        "uid": "delayed-pc-games-2021-when-will-they-be-released",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YHXBCBEAACYAxmNf%22%29+%5D%5D",
        "tags": [
          "Delayed",
          "Steam PC",
          "PC",
          "2021",
          "2022",
          "Release Date",
          "HUMANKIND",
          "Vampire: The Masquerade - Bloodlines 2",
          "Gotham Knights",
          "DEATHLOOP",
          "GUILTY GEAR -STRIVE-",
          "LEGO Star Wars: The Skywalker Saga",
          "Hogwarts Legacy",
          "Back 4 Blood"
        ],
        "first_publication_date": "2021-04-14T11:11:31+0000",
        "last_publication_date": "2021-04-14T14:45:52+0000",
        "slugs": [
          "delayed-pc-games-from-2021---when-will-they-be-released"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-04-14T11:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Delayed PC games from 2021 - When will they be released",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/2fcda663-b1f0-47a3-a2f3-3b93e98e6633_VampireTheMasqueradeBloodlines2.jpg?auto=compress,format&rect=0,0,2560,1440&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/2fcda663-b1f0-47a3-a2f3-3b93e98e6633_VampireTheMasqueradeBloodlines2.jpg?auto=compress,format&rect=0,0,2560,1440&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/2fcda663-b1f0-47a3-a2f3-3b93e98e6633_VampireTheMasqueradeBloodlines2.jpg?auto=compress,format&rect=0,0,2560,1440&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/2fcda663-b1f0-47a3-a2f3-3b93e98e6633_VampireTheMasqueradeBloodlines2.jpg?auto=compress,format&rect=0,0,2560,1440&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Major games releases that are now arriving later than originally planned",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {
      "rating_score": 5,
      "total_ratings": 1,
      "percent_recommended": 100,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 0,
        "four_star_percentage": 0,
        "five_star_percentage": 100
      },
      "reviewLocales": [],
      "total_written_reviews": 0
    },
    "streams": [
      {
        "id": "43312376812",
        "user_name": "RedPhoenix596",
        "type": "live",
        "title": "Humankind multiplayer !hkdiscord !woof !conan  !ustmip",
        "started_at": "2021-09-20T04:31:28Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_redphoenix596-{width}x{height}.jpg"
      },
      {
        "id": "43766927325",
        "user_name": "Begrol",
        "type": "live",
        "title": " HUMANKIND Ачивки делаем !макс сложность",
        "started_at": "2021-09-20T06:42:13Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_begrol-{width}x{height}.jpg"
      },
      {
        "id": "43767253101",
        "user_name": "DommyBaer",
        "type": "live",
        "title": "[GER 18+] Humankind: Spiel, Zug und Sieg!",
        "started_at": "2021-09-20T07:46:28Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_dommybaer-{width}x{height}.jpg"
      },
      {
        "id": "43312891884",
        "user_name": "Sandwarrior84",
        "type": "live",
        "title": "(+18) Manqueando al Humankind y charlando mientras civilizo el mundo...",
        "started_at": "2021-09-20T08:30:17Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sandwarrior84-{width}x{height}.jpg"
      },
      {
        "id": "43312840540",
        "user_name": "Chez_Tzinntch",
        "type": "live",
        "title": "On contrôle le monde avec SamOty. | Subtember | !zth !voice !madame !discord !twitter",
        "started_at": "2021-09-20T08:08:55Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_chez_tzinntch-{width}x{height}.jpg"
      },
      {
        "id": "43312847740",
        "user_name": "Sam0ty",
        "type": "live",
        "title": "[BE] La machine de guerre est en marche! / !alemia / !fun / !bits / !Duel !plant !run !gamble",
        "started_at": "2021-09-20T08:12:06Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sam0ty-{width}x{height}.jpg"
      },
      {
        "id": "43312792828",
        "user_name": "SylloGame",
        "type": "live",
        "title": "Medeniyet dediğin tek dişi kalmış canavar",
        "started_at": "2021-09-20T07:49:14Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_syllogame-{width}x{height}.jpg"
      },
      {
        "id": "43312697036",
        "user_name": "KhanaeLeff",
        "type": "live",
        "title": "Y'arr ! Science & Progrès !",
        "started_at": "2021-09-20T07:03:43Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_khanaeleff-{width}x{height}.jpg"
      }
    ]
  },
  {
    "_id": "5f7f251c914e0000e9b6aec2",
    "__v": 5,
    "age": {
      "ACB": 0,
      "USK": 0,
      "PEGI": 3,
      "ESRB": 6
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_from": "2021-05-28T15:00:00.000Z",
      "valid_until": null
    },
    "bundles": [],
    "collections": [],
    "cover": "85359927-31d7-4365-b923-15c92ed39871.jpeg",
    "developers": [
      "Codemasters Birmingham"
    ],
    "display_type": "game",
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "features": [
      "SharedSplit Screen",
      "Steam Achievements",
      "Partial Controller Support",
      "Steam Cloud",
      "Remote Play Together"
    ],
    "franchises": [
      "Formula One"
    ],
    "genres": [
      "Racing"
    ],
    "img": [
      {
        "order": "99",
        "slug": "b44ead04-43e3-4b5d-a631-3dc06c0f28f7.jpeg",
        "alt": "ss_9d638ba5a428f66e8e1e6afedb6079c24f42462e.1920x1080"
      },
      {
        "order": "99",
        "slug": "e34f2067-631d-4a33-90a5-faa3642afda1.jpeg",
        "alt": "ss_aad31ed5a01dfdbc642de62cd76dae045c4fb541.1920x1080"
      },
      {
        "order": "99",
        "slug": "71e3519e-0ada-4c1c-8f37-05cdf46bcf9c.jpeg",
        "alt": "ss_442d68619f46f3e296d84706e53cbd7881baabfa.1920x1080"
      },
      {
        "order": "99",
        "slug": "971c4f1a-5631-45a8-9d48-b3d933b9717e.jpeg",
        "alt": "ss_afde0432d9152a3f1ea1de98afdc98bca96feefd.1920x1080"
      },
      {
        "order": "99",
        "slug": "8c35c9e3-8eff-419f-99fd-43fa80900420.jpeg",
        "alt": "ss_f5fec2189019452ff47ec8c3b750fd166caa8589.1920x1080"
      },
      {
        "order": "99",
        "slug": "7064c7f7-d294-4b1b-8aff-4bf00d2ef25b.jpeg",
        "alt": "ss_801e9c70f6de8b713d40bd62397ec18fa087b0f3.1920x1080"
      },
      {
        "order": "99",
        "slug": "69031fd0-1899-4e25-b9b7-e74eb59315b6.jpeg",
        "alt": "ss_2d06c26f22c4f8ac1f83754e03413714d35dceb8.1920x1080"
      },
      {
        "order": "99",
        "slug": "2d2cb669-9040-4b44-8c97-492ad20a28a8.jpeg",
        "alt": "ss_db774aefe6d393c908746dbde14b92a5e1ba8e3a.1920x1080"
      },
      {
        "order": "99",
        "slug": "028cbfc4-7807-43ed-863e-02c81beb44db.jpeg",
        "alt": "ss_2f93fe6d1cddc3a5be612310790d58e6f1a62814.1920x1080"
      },
      {
        "order": "99",
        "slug": "1fb3fb87-4a9e-4644-a895-5eb9641b68a3.jpeg",
        "alt": "ss_dfc86882e273d420c8833213381f3bc8ae100bc8.1920x1080"
      },
      {
        "order": "99",
        "slug": "3cfc9e3a-6b03-411b-80fe-6afb3949bd46.jpeg",
        "alt": "ss_88b82d4f102a47a486cf9bbd29343ceacdcbf7e7.1920x1080"
      },
      {
        "order": "99",
        "slug": "2e62c118-538a-4583-8214-ed6dc120d7d2.jpeg",
        "alt": "ss_6d851c52046b10434c11af68f6d3c532fde8a36d.1920x1080"
      },
      {
        "slug": "6b3bb2c5-d2ef-45b9-a132-d3d546d302d4.jpeg",
        "alt": "ss_035cb24f1c95993ca0166dcd339b1a3f6cd8e778.1920x1080"
      }
    ],
    "lang": [
      "English",
      "German",
      "French",
      "Italian",
      "Spanish - Spain",
      "Japanese",
      "Polish",
      "Portuguese - Brazil"
    ],
    "modes": [
      "Singleplayer"
    ],
    "name": "F1 RACE STARS Complete Edition",
    "notice": {
      "legal": "© 2012 The Codemasters Software Company Limited (\"Codemasters\"). All rights reserved. \"Codemasters”® , “Ego”® and the Codemasters logo are registered trademarks owned by Codemasters. “Codemasters Racing”™ and “RaceNet”™ are trademarks of Codemasters. An official product of the FIA FORMULA ONE WORLD CHAMPIONSHIP. FORMULA 1, FORMULA ONE, F1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing BV, a Formula One group company. Licensed by Formula One World Championship Limited. All rights reserved.All other copyrights or trademarks are the property of their respective owners and are being used under license. Unauthorised copying, adaptation, rental, lending, re-sale, arcade use, charging for use, broadcast, cable transmission, public performance, distribution or extraction of this product or any trademark or copyright work that forms part of this product is prohibited. Developed and published by Codemasters."
    },
    "platform_specs": {
      "win": {
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong>Windows Vista or Windows 7 64 bit<br>\t</li><li><strong>Processor:</strong>Intel Core i7/AMD Bulldozer<br>\t</li><li><strong>Memory:</strong>4 GB RAM<br>\t</li><li><strong>Graphics:</strong>AMD HD6000 Series/Nvidia GTX500 Series<br>\t</li><li><strong>Hard Drive:</strong>5 GB HD space<br> </li><li><strong>DirectX®:</strong> 11<br></li><li><strong>Sound:</strong> DirectX® compatible sound card<br>\t<br>\t</li><li><strong>Other Requirements:</strong>Broadband Internet connection<br></li><li><strong>Additional:</strong>AMD Radeon HD2600 or higher, HD3650 or higher, HD4550 or higher, HD5000 Series, HD6000 Series, HD7000 Series. nVidia GeForce 8600 or higher, 9500 or higher, GTX220 or higher, GTX400 Series, GTX500 Series, GTX600 Series. Intel HD Graphics 3000 or higher, AMD Fusion A8 or higher.</li></ul>",
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows Vista or Windows 7<br>\t</li><li><strong>Processor:</strong>Intel Core 2 Duo 2.4GHz or AMD Athlon X2 5400+<br>\t</li><li><strong>Memory:</strong>2 GB RAM<br>\t</li><li><strong>Graphics:</strong>AMD HD2600 or NVIDIA Geforce 8600<br>\t</li><li><strong>Hard Drive:</strong>5 GB HD space space<br> </li><li><strong>DirectX®:</strong> 11<br></li><li><strong>Sound:</strong> DirectX® compatible sound card<br><br>\t</li><li><strong>Other Requirements:</strong>Broadband Internet connection<br><br></li><li><strong>Additional:</strong>Supported Graphics Cards: AMD Radeon HD2600 or higher, HD3650 or higher, HD4550 or higher, HD5000 Series, HD6000 Series, HD7000 Series. nVidia GeForce 8600 or higher, 9500 or higher, GTX220 or higher, GTX400 Series, GTX500 Series, GTX600 Series. Intel HD Graphics 3000 or higher, AMD Fusion A8 or higher.<br><br></li><li><strong>Note:</strong> Not compatible with all integrated sound/graphics solutions (inc. Laptops).</li></ul>"
      }
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 511700,
      "RUB": 389400,
      "AUD": 6659,
      "CAD": 4876,
      "EUR": 4006,
      "USD": 4386,
      "GBP": 3156
    },
    "publishers": [
      "Codemasters"
    ],
    "quotes": [],
    "release": "2020-08-27T11:23:57.662Z",
    "seo": {
      "desc": "Experience the world of Formula One as you've never seen it before with your F1 RACE STARS Complete Editon Steam PC key. Includes base game and all DLC",
      "title": null
    },
    "showReview": true,
    "slug": "f-1-race-stars-complete-edition",
    "steam": {
      "packages": [],
      "dlc": [
        220812,
        220811,
        220813,
        220801,
        220802,
        220803,
        220804,
        220805,
        220806,
        220807,
        220808,
        220809,
        220810
      ],
      "release": "2012-11-15T00:00:00.000Z",
      "id": null,
      "type": "app"
    },
    "type": "game",
    "url": "http://www.f1racestars.com/",
    "video": [
      "XdiA-b86Vro"
    ],
    "visible": {
      "valid_from": "2021-05-28T15:00:00.000Z",
      "valid_until": null
    },
    "regions_excluded": [],
    "regions_included": [],
    "downloads": [],
    "template_type": "standard",
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "free_redeem_code": null,
    "desc": "<p>Experience the world of Formula One as you've never seen it before with your F1 RACE STARS Complete Editon Steam PC key. In this fun racing game from Codemasters, you'll get to play as all of your officially licensed favorite F1 stars and teams, as you sprint for the checkered flag on famous circuits transformed to feature jumps, loop-the-loops, and shortcuts and use a cool range of awesome power-ups to overtake your rivals.</p>&#10;<p><strong>THE BIG STAGE</strong><br/>Travel the world and enter a wide range of different Championships in career mode and set your fastest lap in Time Trials. Then it's time to share the fun with friends and family - accessible controls make F1 RACE STARS perfect for split-screen racing with up to four players or dive into 12 player online races and take on the world.</p>&#10;<p>Connect F1 RACE STARS to Codemasters&#8217; free online hub RaceNet to track your races, rewards, and rivals and enter community events!</p>&#10;<p><strong>NOT YOUR AVERAGE F1 RACER</strong><br/>Collect and use crazy power-ups to overtake your rivals in heated races. Travel the world and enter a range of Championships in career mode, and set your fastest lap and climb leaderboards in Time Trials.</p>&#10;<p>Race as Sebastian Vettel, Lewis Hamilton, Kimi R&#228;ikk&#246;nen, and many other official F1 drivers, or play as new fictional drivers&#160;Ruby Power and Jessica Chekker (Team&#160;TecNova-Star) and&#160;Josh Merit and Kira Hoshihara (Team&#160;Satsu-Aceler).</p>&#10;<p><strong>YOUR OFFICIALLY LICENSED F1 RACE STARS COMPLETE EDITION STEAM PC KEY INCLUDES:</strong></p>&#10;<ul class=\"bb_ul\">&#10;<li>F1 RACE STARS base game and all DLC.</li>&#10;<li>Officially licensed Formula One cars and teams.</li>&#10;<li>Accessible controls for wheel-to-wheel competition.</li>&#10;<li>Fun circuits with speed through loop-the-loops, shortcuts, jumps, and more!</li>&#10;<li>Four-player split-screen local play and split-screen online racing with up to 12 players.</li>&#10;<li>Connect F1 RACE STARS to Codemasters&#8217; free online hub RaceNet to track your races, rewards and rivals and enter community events!</li>&#10;</ul>",
    "hitcardVideo": "jwy7G4gE1rT09GqrjZDWt77DKKz4k-480p.mp4",
    "parent_slug": "f-1-race-stars",
    "supplier_id": "5f1ab0e63651150085f08a2c",
    "currentPrice": {
      "JPY": 511700,
      "RUB": 389400,
      "AUD": 6659,
      "CAD": 4876,
      "EUR": 4006,
      "USD": 4386,
      "GBP": 3156
    },
    "current_discount": {
      "percent": 0,
      "display_percentage": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "recommendations": [
      "sonic-all-stars-racing-transformed",
      "f-1-2021-deluxe-edition",
      "f-1-2021",
      "team-sonic-racing",
      "grip",
      "project-cars-game-of-the-year-edition",
      "sprint-vector",
      "rock-of-ages-3-make-break",
      "road-redemption",
      "assetto-corsa-dream-pack-1",
      "unrailed",
      "the-crew-ultimate-edition",
      "kart-kraft",
      "trailmakers",
      "race-arcade"
    ],
    "recommendations_challenger": [
      "sonic-all-stars-racing-transformed",
      "f-1-2021-deluxe-edition",
      "f-1-2021",
      "team-sonic-racing",
      "grip",
      "project-cars-game-of-the-year-edition",
      "sprint-vector",
      "rock-of-ages-3-make-break",
      "road-redemption",
      "assetto-corsa-dream-pack-1",
      "unrailed",
      "the-crew-ultimate-edition",
      "kart-kraft",
      "trailmakers",
      "race-arcade"
    ],
    "videos": [
      {
        "id": "uWzHZdFO7Zc",
        "title": "F1 RACE STARS | &#39;ELIMINATION&#39; (W/ ZERKAA, BEH2INGA &amp; TBJZL)",
        "date": "2014-05-19T16:00:05Z",
        "thumbnail_url": "https://i.ytimg.com/vi/uWzHZdFO7Zc/hqdefault.jpg"
      },
      {
        "id": "yK1y87nUh90",
        "title": "F1 Race Stars - Decimo Quinta Copa (3000cc)",
        "date": "2021-05-09T13:38:03Z",
        "thumbnail_url": "https://i.ytimg.com/vi/yK1y87nUh90/hqdefault.jpg"
      },
      {
        "id": "VLIUEPOynJ0",
        "title": "F1 Race stars",
        "date": "2021-03-26T17:01:41Z",
        "thumbnail_url": "https://i.ytimg.com/vi/VLIUEPOynJ0/hqdefault.jpg"
      },
      {
        "id": "K2TtESnjL4k",
        "title": "GBA information F1 Race Stars",
        "date": "2021-09-06T08:00:06Z",
        "thumbnail_url": "https://i.ytimg.com/vi/K2TtESnjL4k/hqdefault.jpg"
      },
      {
        "id": "9Stk6QzHrp0",
        "title": "F1 Race Stars fun *.*",
        "date": "2020-04-26T17:04:23Z",
        "thumbnail_url": "https://i.ytimg.com/vi/9Stk6QzHrp0/hqdefault.jpg"
      },
      {
        "id": "FbylXaTqo_8",
        "title": "F1 race stars",
        "date": "2016-05-23T15:55:43Z",
        "thumbnail_url": "https://i.ytimg.com/vi/FbylXaTqo_8/hqdefault.jpg"
      },
      {
        "id": "ExElsD3ANgE",
        "title": "F1 Race Stars Demo Game Play",
        "date": "2012-11-07T02:21:06Z",
        "thumbnail_url": "https://i.ytimg.com/vi/ExElsD3ANgE/hqdefault.jpg"
      },
      {
        "id": "h2cJK1S8KY8",
        "title": "F1 Race Stars - 7.  PC Steam game",
        "date": "2018-06-07T17:44:50Z",
        "thumbnail_url": "https://i.ytimg.com/vi/h2cJK1S8KY8/hqdefault.jpg"
      }
    ],
    "userReviewData": {
      "reviews": [
        {
          "_id": "61366838e5364e1c832250a4",
          "slug": "f-1-race-stars-complete-edition",
          "rating": 4,
          "display_name": "Twincam",
          "title": "F1 meets mario",
          "text": "Fun Mario cart style game. Mix it with formula 1 and you'll have a fun time in single player or with friends. Great fun game",
          "date": "2021-09-06T19:14:09.190Z",
          "staff_review": false,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "5f7f251c914e0000e9b6aec2",
          "version_id": "61366881c36a68009db65f60",
          "published": true,
          "has_active_version": true,
          "removed": false
        }
      ]
    },
    "userReviewSummary": {
      "rating_score": 4,
      "total_ratings": 17,
      "percent_recommended": 76,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 11.76470588235294,
        "three_star_percentage": 17.647058823529413,
        "four_star_percentage": 29.411764705882355,
        "five_star_percentage": 41.17647058823529
      },
      "reviewLocales": [
        "pt",
        "es",
        "zh-hans",
        "en"
      ],
      "total_written_reviews": 8
    }
  },
  {
    "_id": "5fbbb07d57013300851864da",
    "__v": 0,
    "age": {
      "ESRB": 0,
      "PEGI": 0,
      "USK": 0,
      "ACB": 0
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_from": "2021-09-13T15:10:00.000Z",
      "valid_until": null
    },
    "bundles": [],
    "collections": [
      "email coupon new releases"
    ],
    "developers": [
      "Arkane Studios"
    ],
    "display_type": "game",
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "features": [
      "PvP",
      "Online PvP",
      "Full controller support"
    ],
    "franchises": [
      "DEATHLOOP"
    ],
    "genres": [
      "Action"
    ],
    "img": [
      {
        "order": "99",
        "slug": "5af2db6d-3ffe-4506-a680-f79775a3325a.png",
        "alt": "Deathloop_Bunker Break.png"
      },
      {
        "order": "99",
        "slug": "959363f8-b0a5-4169-a074-2b1e3330b85f.png",
        "alt": "Deathloop_Chain Reaction.png"
      },
      {
        "order": "99",
        "slug": "78672c00-00a1-41f7-9c27-d31dbb76d0bb.png",
        "alt": "Deathloop_Egor.png"
      },
      {
        "order": "99",
        "slug": "73ba2c3f-f3c7-4902-8de8-bbc0ce35df3f.png",
        "alt": "Deathloop_Freedom is a Trap.png"
      },
      {
        "order": "99",
        "slug": "65bea7b0-eff9-4199-a678-fca17c6657df.png",
        "alt": "Deathloop_Hacking.png"
      },
      {
        "order": "99",
        "slug": "bf83ad5f-3427-45d0-a1e0-b0496f50dd28.png",
        "alt": "Deathloop_Rival Showdown.png"
      },
      {
        "slug": "1fff895d-7da8-46e8-9759-c13ae9f875fc.png",
        "alt": "Deathloop_Wolf Den.png"
      }
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish - Spain",
      "Arabic",
      "Japanese",
      "Korean",
      "Polish",
      "Portuguese - Brazil",
      "Russian",
      "Simplified Chinese",
      "Spanish - Latin America",
      "Traditional Chinese"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer"
    ],
    "name": "DEATHLOOP",
    "notice": {
      "legal": "© 2021 ZeniMax Media Inc. Developed in association with Arkane Studios. Deathloop, Arkane, Bethesda, Bethesda Softworks, ZeniMax and related logos are registered trademarks or trademarks of ZeniMax Media Inc. in the U.S. and/or other countries. All Rights Reserved."
    },
    "platform_specs": {
      "win": {
        "min": "MINIMUM SPECS: 1080P / 30 FPS WITH LOW SETTINGS<br />\nOS : 64 bit Windows 10 version 1909 or higher<br />\nProcessor : Intel Core i5-8400 @ 2.80GHz or AMD Ryzen 5 1600<br />\nMemory : 12 GB<br />\nGraphics : Nvidia GTX 1060 (6GB) or AMD Radeon RX 580 (8GB)<br />\nDirectX : Version 12<br />\nStorage : 30 GB available space (HDD)<br />",
        "rec": "RECOMMENDED SPECS: 1080P / 60 FPS WITH HIGH SETTINGS<br />\nOS : 64 bit Windows 10 version 1909 or higher<br />\nProcessor : Intel Core i7-9700K @ 3.60GHz or AMD Ryzen 7 2700X<br />\nMemory : 16 GB<br />\nGraphics : Nvidia RTX 2060 (6GB) or AMD Radeon RX 5700 (8GB)<br />\nDirectX : Version 12<br />\nStorage : 30 GB available space (SSD)<br />"
      }
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 877800,
      "RUB": 537500,
      "AUD": 9995,
      "CAD": 7999,
      "EUR": 5999,
      "USD": 5999,
      "GBP": 4999
    },
    "publishers": [
      "Bethesda Softworks"
    ],
    "quotes": [],
    "regions_excluded": [
      {
        "_id": "5fbbc6f85701330085186514",
        "code": "RU",
        "name": "Russian Federation"
      },
      {
        "_id": "5fbbc6f85701330085186513",
        "code": "AM",
        "name": "Armenia"
      },
      {
        "_id": "5fbbc6f85701330085186512",
        "code": "AZ",
        "name": "Azerbaijan"
      },
      {
        "_id": "5fbbc6f85701330085186511",
        "code": "BY",
        "name": "Belarus"
      },
      {
        "_id": "5fbbc6f85701330085186510",
        "code": "GE",
        "name": "Georgia"
      },
      {
        "_id": "5fbbc6f8570133008518650f",
        "code": "KZ",
        "name": "Kazakhstan"
      },
      {
        "_id": "5fbbc6f8570133008518650e",
        "code": "KG",
        "name": "Kyrgyzstan"
      },
      {
        "_id": "5fbbc6f8570133008518650d",
        "code": "MD",
        "name": "Moldova, Republic of"
      },
      {
        "_id": "5fbbc6f8570133008518650c",
        "code": "TJ",
        "name": "Tajikistan"
      },
      {
        "_id": "5fbbc6f8570133008518650b",
        "code": "TM",
        "name": "Turkmenistan"
      },
      {
        "_id": "5fbbc6f8570133008518650a",
        "code": "UZ",
        "name": "Uzbekistan"
      },
      {
        "_id": "5fbbc6f85701330085186509",
        "code": "UA",
        "name": "Ukraine"
      },
      {
        "_id": "5fbbc6f85701330085186508",
        "code": "AR",
        "name": "Argentina"
      },
      {
        "_id": "5fbbc6f85701330085186507",
        "code": "BR",
        "name": "Brazil"
      },
      {
        "_id": "5fbbc6f85701330085186506",
        "code": "PE",
        "name": "Peru"
      },
      {
        "_id": "5fbbc6f85701330085186505",
        "code": "UY",
        "name": "Uruguay"
      },
      {
        "_id": "5fbbc6f85701330085186504",
        "code": "CN",
        "name": "China"
      },
      {
        "_id": "5fbbc6f85701330085186503",
        "code": "TR",
        "name": "Turkey"
      },
      {
        "_id": "5fbbc6f85701330085186502",
        "code": "US",
        "name": "United States"
      },
      {
        "_id": "5fbbc6f85701330085186501",
        "code": "CA",
        "name": "Canada"
      }
    ],
    "regions_included": [],
    "release": "2020-11-23T12:52:12.025Z",
    "seo": {
      "desc": "It's 'time' to experience the explosive next-gen, first-person shooter action with your DEATHLOOP Steam PC key.",
      "title": null
    },
    "showReview": true,
    "slug": "deathloop",
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2021-09-13T23:00:00.000Z",
      "id": 1252330,
      "type": "app"
    },
    "type": "game",
    "url": null,
    "video": [
      "8phmhAoxeIs",
      "vOzRtA9sfFA",
      "ZQUcBWzsusE",
      "MXv5IDp8y74"
    ],
    "visible": {
      "valid_from": "2021-09-13T15:10:00.000Z",
      "valid_until": null
    },
    "cover": "6293b989-56a3-4151-a37e-ef4bf8eafc9d.jpeg",
    "preorder_delivery": false,
    "free_redeem_code": null,
    "twitch_id": 512983,
    "desc": "<p>It's 'time' to experience the explosive next-gen, first-person shooter action with your DEATHLOOP Steam PC key. In this FPS from Arkane Lyon, the award-winning studio behind Dishonored, you'll follow the story and play as two rival assassins trapped in a mysterious timeloop on the island of Blackreef - doomed to repeat the same day for eternity.</p>&#10;<p>As Colt, the only chance for escape is to end the cycle by assassinating eight key targets before the day resets. Learn from each cycle - try new paths, gather intel, and find new weapons and abilities. Do whatever it takes to break the loop.</p>&#10;<p><strong>IF AT FIRST YOU DON'T SUCCEED, DIE DIE AGAIN!<br/></strong>Every new loop is an opportunity to change things up. Use the knowledge you gain from each attempt to change up your playstyle, stealthily sneaking through levels or barreling into the fight, guns-blazing.</p>&#10;<p>In each loop you&#8217;ll discover new secrets, gather intel on your targets as well as the island of Blackreef, and expand your arsenal. Armed with a host of otherworldly abilities and savage weaponry, you&#8217;ll utilize every tool at your command to execute takedowns that are as striking as they are devastating.</p>&#10;<p>Customize your loadout wisely to survive this deadly game of hunter vs hunted.</p>&#10;<p><strong>BREAK OR PROTECT THE LOOP<br/></strong>Are you the hero or the villain? You&#8217;ll experience DEATHLOOP&#8217;s main story as Colt, hunting down targets across the island of Blackreef to break the loop and earn your freedom. All the while, you&#8217;ll be hunted by your rival Julianna, who can be controlled by another player.</p>&#10;<p>If you&#8217;re feeling devious, you, too, can step into Julianna&#8217;s stylish sneakers and invade another player&#8217;s campaign to kill Colt. The multiplayer experience is completely optional, and players can choose to have Julianna controlled by AI within their campaign.</p>&#10;<p><strong>PARADISE OR PRISON<br/></strong>Arkane is renowned for magnificently artistic worlds with multiple pathways and emergent gameplay. DEATHLOOP will present a stunning, retro-future, 60s-inspired environment, that feels like a character within itself.</p>&#10;<p>While Blackreef may be a stylish wonderland, for Colt it is his prison, a world ruled by decadence where death has no meaning, and delinquents party forever while keeping him captive.</p>&#10;<p><strong>YOUR OFFICIAL DEATHLOOP STEAM PC KEY INCLUDES:</strong></p>&#10;<ul>&#10;<li>Unique abilities and weapons to eliminate targets.</li>&#10;<li>Groundhog Day-style gameplay with a quirky cast of characters.</li>&#10;<li>Retro-future, 60s-inspired environment to explore in time loops.</li>&#10;<li>Competitive multiplayer option to jump into another player's game as Julianna.</li>&#10;<li>Next-gen shooter from Arkane Studios, the team behind the Dishonored series.</li>&#10;</ul>",
    "hitcardVideo": "n0x03Q6840Hv4nNBlPpwfZZRvGVnr-480p.mp4",
    "supplier_id": "55db244ad3b050fe108b468a",
    "currentPrice": {
      "JPY": 728574,
      "RUB": 446125,
      "AUD": 8295,
      "CAD": 6639,
      "EUR": 4979,
      "USD": 4979,
      "GBP": 4149
    },
    "current_discount": {
      "percent": 0.17,
      "display_percentage": true,
      "until": "2021-09-29T07:00:00.000Z",
      "from": "2021-09-13T23:00:00.000Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": false,
      "highlighted": true
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "bundles": [],
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "DEATHLOOP",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 877800,
          "RUB": 537500,
          "AUD": 9995,
          "CAD": 7999,
          "EUR": 5999,
          "USD": 5999,
          "GBP": 4999
        },
        "slug": "deathloop",
        "type": "game",
        "cover": "6293b989-56a3-4151-a37e-ef4bf8eafc9d.jpeg",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 728574,
          "RUB": 446125,
          "AUD": 8295,
          "CAD": 6639,
          "EUR": 4979,
          "USD": 4979,
          "GBP": 4149
        },
        "current_discount": {
          "percent": 0.17,
          "display_percentage": true,
          "until": "2021-09-29T07:00:00.000Z",
          "from": "2021-09-13T23:00:00.000Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": false,
          "highlighted": true
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Standard Edition"
      },
      {
        "bundles": [],
        "cover": "22543824-e21b-4414-82ce-ba1a3ab4ac58.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "DEATHLOOP - Deluxe Edition",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 1097800,
          "RUB": 716200,
          "AUD": 12995,
          "CAD": 10999,
          "EUR": 7999,
          "USD": 7999,
          "GBP": 6499
        },
        "slug": "deathloop-deluxe-edition",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 911174,
          "RUB": 594446,
          "AUD": 10785,
          "CAD": 9129,
          "EUR": 6639,
          "USD": 6639,
          "GBP": 5394
        },
        "current_discount": {
          "percent": 0.17,
          "display_percentage": true,
          "until": "2021-09-29T07:00:00.000Z",
          "from": "2021-09-13T23:00:00.000Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": false,
          "highlighted": true
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Deluxe Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "edition_name": "Standard Edition",
    "recommendations": [
      "deathloop-deluxe-edition",
      "dishonored-complete-collection",
      "dishonored-2",
      "dishonored-death-of-the-outsider",
      "sniper-ghost-warrior-contracts-2-deluxe-arsenal-edition",
      "payday-2",
      "doom",
      "hitman-game-of-the-year-edition",
      "sniper-elite-3",
      "dishonored",
      "tom-clancys-ghost-recon-wildlands",
      "sniper-ghost-warrior-contracts-2",
      "turok-2-seeds-of-evil",
      "assassins-creed-brotherhood-deluxe-edition",
      "sniper-ghost-warrior-contracts"
    ],
    "recommendations_challenger": [
      "deathloop-deluxe-edition",
      "dishonored-complete-collection",
      "dishonored-2",
      "dishonored-death-of-the-outsider",
      "sniper-ghost-warrior-contracts-2-deluxe-arsenal-edition",
      "payday-2",
      "doom",
      "hitman-game-of-the-year-edition",
      "sniper-elite-3",
      "dishonored",
      "tom-clancys-ghost-recon-wildlands",
      "sniper-ghost-warrior-contracts-2",
      "turok-2-seeds-of-evil",
      "assassins-creed-brotherhood-deluxe-edition",
      "sniper-ghost-warrior-contracts"
    ],
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "Eurogamer",
        "message": "\"A brilliant timeloop shooter that gives Dishonored's best tricks and techniques more opportunity to shine.\"",
        "url": "https://www.eurogamer.net/articles/2021-09-12-deathloop-review",
        "displayScore": "Essential",
        "outletImage": "https://cdn.fanatical.com/production/logos/eurogamer.jpg",
        "author": "Edwin Evans-Thirlwell"
      },
      {
        "scoreType": "text",
        "outletName": "IGN",
        "message": "\"Deathloop encases fun investigation work and satisfying combat in a unique time loop mechanic to create a tremendously satisfying adventure.\"",
        "url": "https://www.ign.com/articles/deathloop-review",
        "displayScore": "10 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/ign.jpg",
        "author": "Matt Purslow"
      },
      {
        "scoreType": "text",
        "outletName": "GameSpot",
        "message": "\"Arkane Lyon's follow-up to Dishonored is a masterclass in open-ended action game design.\"",
        "url": "https://www.gamespot.com/reviews/deathloop-review-all-you-need-is-kill/1900-6417729/",
        "displayScore": "10 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/gamespot.jpg",
        "author": "Tamoor Hussain"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/10993/deathloop",
    "opencriticScoreString": "88% Mighty",
    "opencriticReviewCount": 121,
    "opencriticPercentRecommended": 94,
    "openCriticScore": 88,
    "videos": [
      {
        "id": "aer7v9ZEgxA",
        "title": "Deathloop - Game Over Trophy Guide (How to Kill Charlie within the rules of Condition Detachment)",
        "date": "2021-09-13T22:25:21Z",
        "thumbnail_url": "https://i.ytimg.com/vi/aer7v9ZEgxA/hqdefault.jpg"
      },
      {
        "id": "mmxL2yyRq5c",
        "title": "Moist Meter | Deathloop",
        "date": "2021-09-18T16:00:32Z",
        "thumbnail_url": "https://i.ytimg.com/vi/mmxL2yyRq5c/hqdefault.jpg"
      },
      {
        "id": "kAiW8KNCIiQ",
        "title": "DEATHLOOP - The Horrify Romance of Charlie + Fia // All Scenes",
        "date": "2021-09-19T03:17:48Z",
        "thumbnail_url": "https://i.ytimg.com/vi/kAiW8KNCIiQ/hqdefault.jpg"
      },
      {
        "id": "RtXh1NFwKLU",
        "title": "DeathLoop - Game Over Trophy Guide",
        "date": "2021-09-19T02:20:16Z",
        "thumbnail_url": "https://i.ytimg.com/vi/RtXh1NFwKLU/hqdefault.jpg"
      },
      {
        "id": "6lzAsiC82zk",
        "title": "DEATHLOOP Ending And Final Boss Fight Playstation 5 Ultra HD New Game With Interesting Style",
        "date": "2021-09-13T11:15:30Z",
        "thumbnail_url": "https://i.ytimg.com/vi/6lzAsiC82zk/hqdefault.jpg"
      },
      {
        "id": "crqrlrGpUuc",
        "title": "DEATHLOOP: All Weapons",
        "date": "2021-09-16T02:22:49Z",
        "thumbnail_url": "https://i.ytimg.com/vi/crqrlrGpUuc/hqdefault.jpg"
      },
      {
        "id": "2vXIeypWpWE",
        "title": "Deathloop PVP | 4K 60FPS (Ultra HD)",
        "date": "2021-09-13T12:01:12Z",
        "thumbnail_url": "https://i.ytimg.com/vi/2vXIeypWpWE/hqdefault.jpg"
      },
      {
        "id": "18TJN1PIrDg",
        "title": "Deathloop - Official Gameplay Walkthrough",
        "date": "2021-07-08T22:57:30Z",
        "thumbnail_url": "https://i.ytimg.com/vi/18TJN1PIrDg/hqdefault.jpg"
      }
    ],
    "streams": [
      {
        "id": "43765294429",
        "user_name": "alli90",
        "type": "live",
        "title": "TSI: Time Scene Investigation ✨ #FreeProduct ✨ #Spoilers",
        "started_at": "2021-09-20T03:02:32Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_alli90-{width}x{height}.jpg"
      },
      {
        "id": "43766765757",
        "user_name": "Meloonie",
        "type": "live",
        "title": "Hier passieren tolle Dinge!",
        "started_at": "2021-09-20T06:13:18Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_meloonie-{width}x{height}.jpg"
      },
      {
        "id": "43312818620",
        "user_name": "Terenas",
        "type": "live",
        "title": "OGGI CHIUDIAMO IL LOOP | !predator !sub !discord  ",
        "started_at": "2021-09-20T08:00:08Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_terenas-{width}x{height}.jpg"
      },
      {
        "id": "43312818140",
        "user_name": "Aelthan",
        "type": "live",
        "title": "#sponsored Lundi Matin, Lundi Câlin : Boucle là. [Twitch Bounty DEATHLOOP]",
        "started_at": "2021-09-20T08:00:00Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_aelthan-{width}x{height}.jpg"
      },
      {
        "id": "43767333677",
        "user_name": "PatatoBake",
        "type": "live",
        "title": "Hmmmmm this death seems familiar ",
        "started_at": "2021-09-20T08:02:28Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_patatobake-{width}x{height}.jpg"
      },
      {
        "id": "43765919165",
        "user_name": "wrongpriority",
        "type": "live",
        "title": "(First Playthrough, PS5) 24hr 1K Follower Celebration this Friday 9/24!!! - Jeff-loop Part 1",
        "started_at": "2021-09-20T04:10:40Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_wrongpriority-{width}x{height}.jpg"
      },
      {
        "id": "43312692460",
        "user_name": "TaintedPHILth",
        "type": "live",
        "title": "lets kill the 8!!! INVADE ME DADDY!!!!   #anime #steam #smallstreamer  #Deathloop",
        "started_at": "2021-09-20T07:01:46Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_taintedphilth-{width}x{height}.jpg"
      },
      {
        "id": "43765797069",
        "user_name": "ミヤビ4121",
        "type": "live",
        "title": "秋飽き飽き",
        "started_at": "2021-09-20T03:56:57Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_kuwa4121-{width}x{height}.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "YURghxAAAJB9ULJw",
        "uid": "brief-history-first-person-shooters",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YURghxAAAJB9ULJw%22%29+%5D%5D",
        "tags": [
          "FPS",
          "History",
          "History of"
        ],
        "first_publication_date": "2021-09-17T14:59:58+0000",
        "last_publication_date": "2021-09-17T14:59:58+0000",
        "slugs": [
          "a-brief-history-of-first-person-shooters",
          "a-brief-overview-of-the-fps"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-09-17T15:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "A brief history of first-person shooters",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/1893336e-7673-4c82-a989-db724cd70c02_0ae9f4c5-e23a-45ea-a7ca-a66c36fb4e76.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/1893336e-7673-4c82-a989-db724cd70c02_0ae9f4c5-e23a-45ea-a7ca-a66c36fb4e76.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/1893336e-7673-4c82-a989-db724cd70c02_0ae9f4c5-e23a-45ea-a7ca-a66c36fb4e76.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/1893336e-7673-4c82-a989-db724cd70c02_0ae9f4c5-e23a-45ea-a7ca-a66c36fb4e76.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "It's one of gaming's biggest genres, but where did it come from?",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "YT8q8hAAACEAONLV",
        "uid": "deathloop-reviews---what-are-the-critics-saying-about-the-game",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YT8q8hAAACEAONLV%22%29+%5D%5D",
        "tags": [
          "Reviews",
          "what are the critics saying",
          "Arkane Studios",
          "Action-adventure",
          "Action",
          "action adventure"
        ],
        "first_publication_date": "2021-09-13T15:00:01+0000",
        "last_publication_date": "2021-09-16T14:59:58+0000",
        "slugs": [
          "deathloop-reviews---what-are-the-critics-saying-about-the-game",
          "tales-of-arise-reviews---what-are-the-critics-saying-about-the-game",
          "humankind-reviews---what-are-the-critics-saying-about-the-game"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-09-16T15:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "DEATHLOOP reviews - What are the critics saying about the game",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/37364e85-c95e-418e-b0b2-a381ca3563b3_deathloop-1.jpg?auto=compress,format&rect=0,0,3840,2160&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/37364e85-c95e-418e-b0b2-a381ca3563b3_deathloop-1.jpg?auto=compress,format&rect=0,0,3840,2160&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/37364e85-c95e-418e-b0b2-a381ca3563b3_deathloop-1.jpg?auto=compress,format&rect=0,0,3840,2160&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/37364e85-c95e-418e-b0b2-a381ca3563b3_deathloop-1.jpg?auto=compress,format&rect=0,0,3840,2160&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Critics are loving Arkane Studios' new action game",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {
      "rating_score": 5,
      "total_ratings": 1,
      "percent_recommended": 100,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 0,
        "four_star_percentage": 0,
        "five_star_percentage": 100
      },
      "reviewLocales": [],
      "total_written_reviews": 0
    }
  },
  {
    "_id": "59e61c7bff9d9a8467a36ed1",
    "release": "2017-10-03T14:31:10.026Z",
    "quotes": [],
    "seo": {
      "desc": "Build your empire on a colorful, lively city animated by funny sidekicks with MONOPOLY PLUS. Grab your game key now and see the classic board game come to life!",
      "title": null
    },
    "notice": {
      "legal": "The MONOPOLY name and logo, the distinctive design of the game board, the four corner squares, the MR. MONOPOLY name and character, as well as each of the distinctive elements of board and playing pieces are trademarks of Hasbro for its property trading game and game equipment and are used with permission © 2017 Hasbro. All Rights Reserved. Licensed by Hasbro to Ubisoft Entertainment. Ubisoft and the Ubisoft logo are trademarks of Ubisoft Entertainment in the U.S. and/or other countries. Games software © 2017 Ubisoft Entertainment. All Rights Reserved."
    },
    "age": {
      "ACB": 0,
      "USK": 0,
      "PEGI": 0,
      "ESRB": 6
    },
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": true,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": false,
      "drm_free": false
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 194400,
      "RUB": 99900,
      "AUD": 2049,
      "CAD": 1499,
      "EUR": 1499,
      "USD": 1499,
      "GBP": 1199
    },
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2017-09-07T00:00:00.000Z",
      "id": 562810,
      "type": "app"
    },
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish",
      "Dutch",
      "Russian",
      "Simplified Chinese",
      "Traditional Chinese",
      "Portuguese-Brazil"
    ],
    "genres": [
      "Casual"
    ],
    "publishers": [
      "Ubisoft"
    ],
    "developers": [
      "Asobo Studio"
    ],
    "features": [
      "Online MultiPlayer",
      "Local MultiPlayer",
      "Full controller support"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer"
    ],
    "video": [],
    "regions_excluded": [],
    "regions_included": [
      {
        "code": "AL",
        "name": "Albania",
        "_id": "59f33125ca588215001eaec5"
      },
      {
        "code": "AD",
        "name": "Andorra",
        "_id": "59f33125ca588215001eaec4"
      },
      {
        "code": "AT",
        "name": "Austria",
        "_id": "59f33125ca588215001eaec3"
      },
      {
        "code": "BE",
        "name": "Belgium",
        "_id": "59f33125ca588215001eaec2"
      },
      {
        "code": "BA",
        "name": "Bosnia and Herzegovina",
        "_id": "59f33125ca588215001eaec1"
      },
      {
        "code": "BG",
        "name": "Bulgaria",
        "_id": "59f33125ca588215001eaec0"
      },
      {
        "code": "HR",
        "name": "Croatia",
        "_id": "59f33125ca588215001eaebf"
      },
      {
        "code": "CY",
        "name": "Cyprus",
        "_id": "59f33125ca588215001eaebe"
      },
      {
        "code": "CZ",
        "name": "Czech Republic",
        "_id": "59f33125ca588215001eaebd"
      },
      {
        "code": "DK",
        "name": "Denmark",
        "_id": "59f33125ca588215001eaebc"
      },
      {
        "code": "EE",
        "name": "Estonia",
        "_id": "59f33125ca588215001eaebb"
      },
      {
        "code": "FI",
        "name": "Finland",
        "_id": "59f33125ca588215001eaeba"
      },
      {
        "code": "FR",
        "name": "France",
        "_id": "59f33125ca588215001eaeb9"
      },
      {
        "code": "DE",
        "name": "Germany",
        "_id": "59f33125ca588215001eaeb8"
      },
      {
        "code": "GR",
        "name": "Greece",
        "_id": "59f33125ca588215001eaeb7"
      },
      {
        "code": "HU",
        "name": "Hungary",
        "_id": "59f33125ca588215001eaeb6"
      },
      {
        "code": "IS",
        "name": "Iceland",
        "_id": "59f33125ca588215001eaeb5"
      },
      {
        "code": "IE",
        "name": "Ireland",
        "_id": "59f33125ca588215001eaeb4"
      },
      {
        "code": "IT",
        "name": "Italy",
        "_id": "59f33125ca588215001eaeb3"
      },
      {
        "code": "LV",
        "name": "Latvia",
        "_id": "59f33125ca588215001eaeb2"
      },
      {
        "code": "LI",
        "name": "Liechtenstein",
        "_id": "59f33125ca588215001eaeb1"
      },
      {
        "code": "LT",
        "name": "Lithuania",
        "_id": "59f33125ca588215001eaeb0"
      },
      {
        "code": "LU",
        "name": "Luxembourg",
        "_id": "59f33125ca588215001eaeaf"
      },
      {
        "code": "MK",
        "name": "Macedonia, the Former Yugoslav Republic of",
        "_id": "59f33125ca588215001eaeae"
      },
      {
        "code": "MT",
        "name": "Malta",
        "_id": "59f33125ca588215001eaead"
      },
      {
        "code": "MC",
        "name": "Monaco",
        "_id": "59f33125ca588215001eaeac"
      },
      {
        "code": "ME",
        "name": "Montenegro",
        "_id": "59f33125ca588215001eaeab"
      },
      {
        "code": "NL",
        "name": "Netherlands",
        "_id": "59f33125ca588215001eaeaa"
      },
      {
        "code": "NO",
        "name": "Norway",
        "_id": "59f33125ca588215001eaea9"
      },
      {
        "code": "PL",
        "name": "Poland",
        "_id": "59f33125ca588215001eaea8"
      },
      {
        "code": "PT",
        "name": "Portugal",
        "_id": "59f33125ca588215001eaea7"
      },
      {
        "code": "RO",
        "name": "Romania",
        "_id": "59f33125ca588215001eaea6"
      },
      {
        "code": "SM",
        "name": "San Marino",
        "_id": "59f33125ca588215001eaea5"
      },
      {
        "code": "RS",
        "name": "Serbia",
        "_id": "59f33125ca588215001eaea4"
      },
      {
        "code": "SK",
        "name": "Slovakia",
        "_id": "59f33125ca588215001eaea3"
      },
      {
        "code": "SI",
        "name": "Slovenia",
        "_id": "59f33125ca588215001eaea2"
      },
      {
        "code": "ES",
        "name": "Spain",
        "_id": "59f33125ca588215001eaea1"
      },
      {
        "code": "SE",
        "name": "Sweden",
        "_id": "59f33125ca588215001eaea0"
      },
      {
        "code": "CH",
        "name": "Switzerland",
        "_id": "59f33125ca588215001eae9f"
      },
      {
        "code": "TR",
        "name": "Turkey",
        "_id": "59f33125ca588215001eae9e"
      },
      {
        "code": "GB",
        "name": "United Kingdom",
        "_id": "59f33125ca588215001eae9d"
      }
    ],
    "availability": {
      "valid_from": "2017-10-02T23:00:00.000Z",
      "valid_until": null
    },
    "visible": {
      "valid_from": "2017-10-02T23:00:00.000Z",
      "valid_until": null
    },
    "platform_specs": {
      "win": {
        "min": "<strong>Minimum:</strong><br><br>\nOS: Windows 7 SP1, Windows 8.1, Windows 10 (64-bit versions only)<br>\nPROCESSOR: Intel Core i3-550 3.0 GHz or AMD Phenom II X4 945 3.0 GHz or equivalent<br>\nVIDEO CARD: NVIDIA GeForce GTX460v2 or AMD HD7750 (1024 MB VRAM with Shader Model 5.0 or better) or more – See supported List /*<br>\nSYSTEM RAM: 4GB<br>\nResolution: 720p<br>\nVideo Preset: Default<br>\nOther Requirements:<br>\nSupported NVIDIA cards at time of release:<br>\n- GeForce GTX400 series: (minimum) GeForce GTX460V2 or better | (recommended) N/A<br>\n- GeForce GTX500 series: (minimum) GeForce GTX550Ti or better | (recommended) N/A<br>\n- GeForce GTX600 series: (minimum) GeForce GTX650Ti or better | (recommended) GeForce 680 or better<br>\n- GeForce GTX700 series: (minimum) GeForce GTX730 or better | (recommended) GeForce GTX750Ti or better<br>\n- GeForce GTX900 series: (minimum) GeForce GTX950 or better | (recommended) GeForce GTX960 or better<br>\n- GeForce GTX10-Series: (minimum) any GeForce GTX10 card | (recommended) GeForce GTX1050 or better<br>\nSupported AMD cards at time of release:<br>\n- Radeon HD7000 series: (minimum) Radeon HD7750 or better | (recommended) Radeon HD7870 or better<br>\n- Radeon 200 series: (minimum) Radeon R7 250 or better | (recommended) Radeon R7 260X or better<br>\n- Radeon 300/Fury X series: (minimum) Radeon R7 360 or better | (recommended) Radeon R7 370 or better<br>\n- Radeon 400 series: (minimum) any Radeon 400 series | (recommended) any Radeon 400 series<br>\nGamepad Support<br>\n- Microsoft Xbox 360<br>\n- Microsoft Xbox One (Original/Elite)<br>\n- Steam controller<br>\n- Logitech F310",
        "rec": "<strong>Recommended:</strong><br><br>\nOS: Windows 7 SP1, Windows 8.1, Windows 10 (64-bit versions only)<br>\nPROCESSOR: Intel Core i5- 2400 3.1 GHz or AMD FX-4320 4.0 GHz<br>\nVIDEO CARD: NVIDIA GeForce GTX680 or AMD R7 260X (2GB VRAM with Shader Model 5.0 or better) – See supported List /*<br>\nSYSTEM RAM: 8GB<br>\nResolution: 1080p<br>\nVideo Preset: Default"
      }
    },
    "img": [
      {
        "order": "99",
        "alt": "56e4a01b-3cc2-411c-b047-528955be0407.jpeg",
        "slug": "56e4a01b-3cc2-411c-b047-528955be0407.jpeg"
      },
      {
        "order": "99",
        "alt": "8460d651-bf0a-46f4-ac3b-7678fb9f4dc0.jpeg",
        "slug": "8460d651-bf0a-46f4-ac3b-7678fb9f4dc0.jpeg"
      },
      {
        "order": "99",
        "alt": "f001a3bd-173d-4f6c-9d0a-1cec0d6f8595.jpeg",
        "slug": "f001a3bd-173d-4f6c-9d0a-1cec0d6f8595.jpeg"
      },
      {
        "alt": "f6a97c34-3886-4d35-8df2-2e06ae36fecf.jpeg",
        "slug": "f6a97c34-3886-4d35-8df2-2e06ae36fecf.jpeg"
      }
    ],
    "bundles": [],
    "hideDiscount": false,
    "presale": false,
    "archive": false,
    "desc": "<p><strong>EMBARK ON A JOURNEY TO OWN IT ALL!</strong> <br/><br/>Build your empire on a colorful and 3D lively city animated by funny sidekicks! MONOPOLY PLUS brings the classic franchise to a new level on PC with amazing animations, customizable house rules! <br/><br/><strong>A real living board</strong> <br/><br/>A full 3D city at the center of the board lives and evolves as you play. You own a miniature world where each neighborhood has its own unique identity and characteristics. Its friendly inhabitants will interact with your progression throughout the game and celebrate your achievements, bringing a new dimension to your experience. Feel that you own something special and admire your empire grow right in front of your eyes! <br/><br/><strong>Play the way you want</strong> <br/><br/>You can change the rules and adapt them to your playing style. Play the famous Speed Die mode to spice up your game or select from a catalogue of 6 house rules chosen by Monopoly community members from around the world!</p>",
    "sdesc": null,
    "cover": "c608b99c-b445-4713-8bf4-c7330d0c3dd5.jpeg",
    "url": "https://www.ubisoft.com/en-US/game/monopoly-plus/",
    "slug": "monopoly-plus",
    "name": "MONOPOLY PLUS",
    "display_type": "game",
    "type": "game",
    "fandesc": null,
    "giveaway": false,
    "collections": [
      "Party Games",
      "Spring Sale Encore 2021"
    ],
    "franchises": [],
    "fullPrice": {
      "CAD": 1499,
      "USD": 1499,
      "EUR": 1499,
      "GBP": 1199,
      "AUD": 2049
    },
    "ubisoft_ska": true,
    "template_type": "standard",
    "__v": 200,
    "artists": [],
    "authors": [],
    "downloads": [],
    "showReview": true,
    "twitch_id": 493159,
    "bundleCover": "e3305b2b-2525-4b31-960e-7a9e67d90136.jpeg",
    "audit": [],
    "free_redeem_code": null,
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "hitcardVideo": "YAP3KgYO7zTWA76jlBVLiVMQ9424A-480p.mp4",
    "genba_id": "e4233341-8880-4ac4-85a8-e8d827708b0a",
    "supplier_id": "59b143a190ac0210003b4100",
    "currentPrice": {
      "JPY": 69984,
      "RUB": 35964,
      "AUD": 737,
      "CAD": 539,
      "EUR": 539,
      "USD": 539,
      "GBP": 431
    },
    "current_discount": {
      "percent": 0.64,
      "display_percentage": true,
      "until": "2021-09-20T22:59:00.000Z",
      "from": "2021-09-10T00:01:00.000Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": false,
      "highlighted": false
    },
    "drm_string": "uplay",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "recommendations": [
      "talisman-digital-edition",
      "cities-skylines",
      "khet-2",
      "sid-meiers-civilization-v-aspyr",
      "cities-skylines-deluxe-edition",
      "ticket-to-ride-first-journey",
      "small-world-2",
      "pandemic-the-board-game",
      "sid-meiers-civilization-v",
      "clue-cluedo-the-classic-mystery-game",
      "cardpocalypse",
      "uno",
      "machia-villain",
      "house-party",
      "sim-city-4-deluxe-edition"
    ],
    "recommendations_challenger": [
      "talisman-digital-edition",
      "cities-skylines",
      "khet-2",
      "sid-meiers-civilization-v-aspyr",
      "cities-skylines-deluxe-edition",
      "ticket-to-ride-first-journey",
      "small-world-2",
      "pandemic-the-board-game",
      "sid-meiers-civilization-v",
      "clue-cluedo-the-classic-mystery-game",
      "cardpocalypse",
      "uno",
      "machia-villain",
      "house-party",
      "sim-city-4-deluxe-edition"
    ],
    "videos": [
      {
        "id": "7wFsaQ8UJ5o",
        "title": "Game On! Monopoly Plus: Part 2- Stealing Ben&#39;s Spots",
        "date": "2016-12-19T17:35:30Z",
        "thumbnail_url": "https://i.ytimg.com/vi/7wFsaQ8UJ5o/hqdefault.jpg"
      },
      {
        "id": "vZLBttgWrHA",
        "title": "Now We&#39;re Gaming - Monopoly Plus",
        "date": "2020-06-30T01:09:50Z",
        "thumbnail_url": "https://i.ytimg.com/vi/vZLBttgWrHA/hqdefault.jpg"
      },
      {
        "id": "pYdRqIqVDec",
        "title": "WHO WILL COMES OUT ON TOP!?!? | MONOPOLY PLUS WITH VIXXIE-CHAN! | FINALE",
        "date": "2021-08-16T08:33:22Z",
        "thumbnail_url": "https://i.ytimg.com/vi/pYdRqIqVDec/hqdefault.jpg"
      },
      {
        "id": "hd76dGuanrg",
        "title": "New Year, New Game (Monopoly Plus W/ Friends 1)",
        "date": "2019-01-01T15:00:03Z",
        "thumbnail_url": "https://i.ytimg.com/vi/hd76dGuanrg/hqdefault.jpg"
      },
      {
        "id": "kvhzi08Uo3o",
        "title": "MONOPOLY Plus I Win game #1",
        "date": "2015-05-11T23:11:29Z",
        "thumbnail_url": "https://i.ytimg.com/vi/kvhzi08Uo3o/hqdefault.jpg"
      },
      {
        "id": "xgypeYXlLcA",
        "title": "THE GAME THAT ENDS FRIENDSHIPS! | Monopoly Plus | Episode 1",
        "date": "2018-09-25T19:03:38Z",
        "thumbnail_url": "https://i.ytimg.com/vi/xgypeYXlLcA/hqdefault.jpg"
      },
      {
        "id": "lZ1LWinkfy4",
        "title": "MONOPOLY PLUS Game 1 part 2 With crazykjy",
        "date": "2018-11-22T11:07:26Z",
        "thumbnail_url": "https://i.ytimg.com/vi/lZ1LWinkfy4/hqdefault.jpg"
      },
      {
        "id": "0AzcPpbc84I",
        "title": "Game On! Monopoly Plus: Part 3- Trading Game",
        "date": "2016-12-26T23:13:56Z",
        "thumbnail_url": "https://i.ytimg.com/vi/0AzcPpbc84I/hqdefault.jpg"
      }
    ],
    "streams": [
      {
        "id": "39989541211",
        "user_name": "greasy504",
        "type": "live",
        "title": "im good i sware",
        "started_at": "2021-09-20T02:32:01Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_greasy504-{width}x{height}.jpg"
      },
      {
        "id": "43767572701",
        "user_name": "sevinsay",
        "type": "live",
        "title": "Epic monopoly w1n....",
        "started_at": "2021-09-20T08:54:10Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sevinsay-{width}x{height}.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "YSeeCxAAACMA_P8q",
        "uid": "best-pc-games-based-on-board-games",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YSeeCxAAACMA_P8q%22%29+%5D%5D",
        "tags": [
          "Steam PC",
          "Top picks"
        ],
        "first_publication_date": "2021-08-30T15:00:19+0000",
        "last_publication_date": "2021-09-01T14:08:21+0000",
        "slugs": [
          "the-best-pc-games-based-on-board-games",
          "the-best-games-based-on-board-games-for-pc",
          "the-best-cyberpunk-games-for-pc-gamers"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-08-30T15:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "The best PC games based on board games",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/5871c6dc-e9c9-4614-97f2-a53975c78678_pathfinder2.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/5871c6dc-e9c9-4614-97f2-a53975c78678_pathfinder2.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/5871c6dc-e9c9-4614-97f2-a53975c78678_pathfinder2.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/5871c6dc-e9c9-4614-97f2-a53975c78678_pathfinder2.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Roll the dice, make your moves and enjoy board game inspired video games",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "XnTMtxMAAB8A9ydl",
        "uid": "save-big-with-our-top-spring-sale-publishers-deals",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22XnTMtxMAAB8A9ydl%22%29+%5D%5D",
        "tags": [
          "Publisher",
          "Deals",
          "Spring Sale",
          "Ubisoft",
          "Bethesda",
          "Jackbox Games",
          "Capcom",
          "AAA",
          "Indie"
        ],
        "first_publication_date": "2020-03-20T15:33:41+0000",
        "last_publication_date": "2021-06-07T14:05:18+0000",
        "slugs": [
          "save-big-with-our-top-spring-sale-publisher-deals",
          "save-big-with-our-top-spring-sale-publishers-deals"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2020-03-20T15:30:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Save big with our top Spring Sale publisher deals",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/23a53470-d2c5-48d8-ae5d-39c9ee78602f_GoldRathian.jpg?auto=compress,format&rect=0,0,1200,675&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/23a53470-d2c5-48d8-ae5d-39c9ee78602f_GoldRathian.jpg?auto=compress,format&rect=0,0,1200,675&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/23a53470-d2c5-48d8-ae5d-39c9ee78602f_GoldRathian.jpg?auto=compress,format&rect=0,0,1200,675&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/23a53470-d2c5-48d8-ae5d-39c9ee78602f_GoldRathian.jpg?auto=compress,format&rect=0,0,1200,675&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Hurry, these offers won't be around for long!",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": [
        {
          "_id": "612fd3e5e5364e1c834616fa",
          "slug": "monopoly-plus",
          "rating": 4,
          "display_name": "brandon",
          "title": "piccadilly",
          "text": "piccadilly so silly, all willy nilly",
          "date": "2021-09-01T19:27:25.425Z",
          "staff_review": false,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "5cd191a12c9b138168ee73e8",
          "version_id": "612fd41deb3d0000802bbd80",
          "published": true,
          "has_active_version": true,
          "removed": false
        }
      ]
    },
    "userReviewSummary": {
      "rating_score": 4,
      "total_ratings": 1,
      "percent_recommended": 100,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 0,
        "four_star_percentage": 100,
        "five_star_percentage": 0
      },
      "reviewLocales": [
        "en"
      ],
      "total_written_reviews": 1
    }
  },
  {
    "_id": "5b0d1785ce00e67512dfc8c4",
    "__v": 185,
    "type": "game",
    "display_type": "game",
    "name": "Dying Light: The Following – Enhanced Edition",
    "slug": "dying-light-enhanced-edition",
    "url": "http://www.dyinglightgame.com/",
    "cover": "c2762fdd-8cb7-44a5-83f0-7da657a1f7f5.jpeg",
    "sdesc": null,
    "fandesc": "Just when we thought Dying Light had blown us away with its gripping parkour, awesome combat and engaging city - Techland proved there's more to this action RPG. Travel further, explore hidden storylines and get yourself behind the wheel of fun dirt buggy which not only helps players see the rest of this game's impressive world, but also doubles up as a great way to turn zombies into mush!",
    "desc": "<p><strong>The edition that you&#8217;ll be dying to play</strong> <br/><br/>Take your parkour-fueled zombie survival to a whole new level in the action-packed Dying Light: The Following &#8211; Enhanced Edition. With this Steam key, players will enjoy the definitive Dying Light experience with the brand-new Legend system, improved visuals, major gameplay enhancements, and more. Receive a huge supply of additional content as you travel beyond the walls of Harran to discover a vast, dangerous new region in a massive story-based expansion that brings mysterious characters, deadly new weapons, unexpected quests, and fully customizable and drivable dirt buggies. <br/><br/><strong>DYING LIGHT ON ZOMBIE STEROIDS</strong> <br/>Dying Light is now bigger, better and scarier than ever before. The Enhanced Edition brings 250 unlockable Legend Levels, the dreadfully challenging Nightmare mode, 3 different categories of surprising Bounties, new parkour moves, and more. Enjoy the definitive zombie experience thanks to improved human and zombie AI, upgraded audio, greater firearm variety, enhanced facial expressions, revised character models, and other improvements. <br/><br/><strong>GET BEHIND THE WHEEL</strong> <br/>Take the wheel of a dirt buggy as you continue Kyle Crane&#8217;s story behind the quarantine zone and out in the serene countryside. Investigate a mysterious cult across a region bigger than all areas of the Dying Light game combined. <br/>Make use of new fully customizable and upgradable special weapons, attachments and decals to make your arsenal unique and deadly. <br/><br/><strong>JUICY SEASON PASS CONTENT AND MORE</strong> <br/>This edition gives players a whole year of dev support and additional content to further boost your zombie survival experience. Play through 10 added DLCs with brand-new locations and even a new gun silencer for stealthier gameplay. Play as the formidable Night Hunter in the asymmetric PvP mode &#8216;Be the Zombie&#8217; or take on hardcore challenge missions in Cuisine &amp; Cargo. You&#8217;ll also have access to unique outfits and weapons via the Ultimate Survivor Bundle &#8211; plus with more game modes, which includes conquering the Harran Stadium in &#8216;The Bozak Horde&#8217;, you&#8217;ll be spoilt for choice when it comes to slaying he undead. <br/><br/><strong>GAME-CHANGING DAY &amp; NIGHT CYCLE</strong> <br/>The undead are a threat no matter what time of the day, but once the sun goes down, the hunter becomes the prey as the infected grow in numbers and strength. Not only that, gamers will have to go up against the lethal Volatiles zombies, who leave their nests in the darkness to feed. <br/>Keep your wits about you, and use everything you&#8217;ve learnt to survive till dawn&#8230; <strong>Good night. Good luck.</strong> <br/><br/><strong>PARKOUR!</strong> <br/>Using the game&#8217;s advanced parkour system, players can seamlessly traverse across a vast, open environment. Escape from hunters and dangerous hordes with speed and agility, jump between rooftops, climb walls, and fatally attack your foes from above. <br/>Upgrading this skill will help weaponize your moves to become stronger and unpredictable against the undead and fellow humans who need to be brought to justice. <br/><br/><strong>SURVIVE IN NUMBERS</strong> <br/>Join up with friends and fellow players as you experience the extreme conditions of a zombie outbreak. Dare to venture into the quarantine zone, help guide each other through the addictive campaign, and take part in special co-op challenges. <br/>Stand out from your fellow survivors by customizing your character with a vast array of unique outfits. <br/><br/><strong>THRIVE AND SURVIVE</strong> <br/>Make use of the sunlight by heading out on story missions, side missions and tracking down supply drops to obtain vital supplies for medicine, ammo and crafting melee weapons. Feel the fear as the night draws in and screeches can be heard all around. Where did that noise come from, do you have enough time to grab supplies and make it back alive, these are all questions and scenarios gamers will face in this exhilarating game. <br/><br/><strong>YOUR OFFICIAL DYING LIGHT: THE FOLLOWING &#8211; ENHANCED EDITION STEAM KEY GIVES YOU:</strong></p>&#10;<ul>&#10;<li>Dying Light Enhanced</li>&#10;<li>Dying Light: The Following</li>&#10;<li>Dying Light: Crash Test Skin Pack</li>&#10;<li>Dying Light Season Pass</li>&#10;<li>Intense action RPG survival gameplay</li>&#10;<li>Voice actor Roger Craig Smith (Sonic the Hedgehog) stars as protagonist Kyle Crane</li>&#10;<li>Vast crafting and skills system</li>&#10;<li>Gripping narrative</li>&#10;<li>Parkour like never seen before</li>&#10;<li>Very Positive rated Steam PC game</li>&#10;</ul>&#10;<p><br/><br/></p>",
    "archive": false,
    "giveaway": false,
    "presale": false,
    "hideDiscount": false,
    "bundles": [],
    "img": [
      {
        "slug": "9be86a1b-bda6-49e6-b58a-47910b09180f.jpg",
        "alt": "9be86a1b-bda6-49e6-b58a-47910b09180f",
        "order": "99"
      },
      {
        "slug": "2f3a71ab-38f0-458c-a69b-dcd074cd007b.jpg",
        "alt": "2f3a71ab-38f0-458c-a69b-dcd074cd007b",
        "order": "99"
      },
      {
        "slug": "a68adb28-2631-4c99-b1ac-ca0b48d2212d.jpg",
        "alt": "a68adb28-2631-4c99-b1ac-ca0b48d2212d",
        "order": "99"
      },
      {
        "slug": "c995f518-07d6-46c5-95e1-a0661c51baca.jpg",
        "alt": "c995f518-07d6-46c5-95e1-a0661c51baca",
        "order": "99"
      },
      {
        "slug": "09f133bb-b12e-40eb-ae1b-cad1080e61b3.jpg",
        "alt": "09f133bb-b12e-40eb-ae1b-cad1080e61b3",
        "order": "99"
      },
      {
        "slug": "ab6d126a-0531-497c-8991-d7d67f2dde2d.jpg",
        "alt": "ab6d126a-0531-497c-8991-d7d67f2dde2d",
        "order": "99"
      },
      {
        "slug": "899ca574-b5ac-4805-9e00-70882e1a6511.jpg",
        "alt": "899ca574-b5ac-4805-9e00-70882e1a6511",
        "order": "99"
      },
      {
        "slug": "3b78068e-d785-43bb-8836-384f08f86682.jpg",
        "alt": "3b78068e-d785-43bb-8836-384f08f86682",
        "order": "99"
      },
      {
        "slug": "098ad501-cdaf-4f2d-907d-a41e1e405fea.jpg",
        "alt": "098ad501-cdaf-4f2d-907d-a41e1e405fea",
        "order": "99"
      },
      {
        "slug": "dbb3a588-c3dc-49fc-a239-d807fa859194.jpg",
        "alt": "dbb3a588-c3dc-49fc-a239-d807fa859194",
        "order": "99"
      },
      {
        "slug": "25b1177b-c247-4951-aab8-21940e65b2cc.jpg",
        "alt": "25b1177b-c247-4951-aab8-21940e65b2cc",
        "order": "99"
      },
      {
        "slug": "66e1cd0b-1e43-40fd-8a74-d664b0eff6f4.jpg",
        "alt": "66e1cd0b-1e43-40fd-8a74-d664b0eff6f4",
        "order": "99"
      },
      {
        "slug": "d4b4def5-69b5-433e-8e6c-56527754248a.jpg",
        "alt": "d4b4def5-69b5-433e-8e6c-56527754248a",
        "order": "99"
      },
      {
        "slug": "acecd973-8da4-41e0-bd3c-aea09fcdbebb.jpg",
        "alt": "acecd973-8da4-41e0-bd3c-aea09fcdbebb",
        "order": "99"
      },
      {
        "slug": "0e743648-2a68-45e7-b993-af4fa41d00a2.jpg",
        "alt": "0e743648-2a68-45e7-b993-af4fa41d00a2",
        "order": "99"
      },
      {
        "slug": "1d510ce1-ba4f-4c1c-be47-df092f68a692.jpg",
        "alt": "1d510ce1-ba4f-4c1c-be47-df092f68a692",
        "order": "99"
      },
      {
        "slug": "84c44949-87f9-4058-930c-3883b6ca0381.jpg",
        "alt": "84c44949-87f9-4058-930c-3883b6ca0381",
        "order": "99"
      },
      {
        "slug": "2c5fbaca-84e7-4dd7-8175-cd540f437f5b.jpg",
        "alt": "2c5fbaca-84e7-4dd7-8175-cd540f437f5b",
        "order": "99"
      },
      {
        "slug": "7bd88646-7a7d-418e-afb5-359ebb8d7e23.jpg",
        "alt": "7bd88646-7a7d-418e-afb5-359ebb8d7e23",
        "order": "99"
      },
      {
        "slug": "318180bc-8455-465f-9763-a7bbb52c9923.jpg",
        "alt": "318180bc-8455-465f-9763-a7bbb52c9923",
        "order": "99"
      },
      {
        "slug": "75cc06b2-42b7-44d9-90bd-75520ff863ef.jpg",
        "alt": "75cc06b2-42b7-44d9-90bd-75520ff863ef",
        "order": "99"
      },
      {
        "slug": "c7ae6883-f566-4e74-a37c-def6753c556f.jpg",
        "alt": "c7ae6883-f566-4e74-a37c-def6753c556f",
        "order": "99"
      },
      {
        "slug": "3d821adf-ae56-4a4a-97e5-1f0e96ec311b.jpg",
        "alt": "3d821adf-ae56-4a4a-97e5-1f0e96ec311b",
        "order": "99"
      },
      {
        "slug": "c70d30c6-d0e8-41f9-b9c8-a12d983310eb.jpg",
        "alt": "c70d30c6-d0e8-41f9-b9c8-a12d983310eb",
        "order": "99"
      },
      {
        "slug": "28a20474-4b80-4ea6-b567-89db2efaca3b.jpg",
        "alt": "28a20474-4b80-4ea6-b567-89db2efaca3b",
        "order": "99"
      },
      {
        "slug": "b9aec83d-1f47-41d1-806f-c82c67ea82ca.jpg",
        "alt": "b9aec83d-1f47-41d1-806f-c82c67ea82ca",
        "order": "99"
      },
      {
        "slug": "ed76a0bb-ca7d-4b4b-9269-74d1a6900bde.jpg",
        "alt": "ed76a0bb-ca7d-4b4b-9269-74d1a6900bde",
        "order": "99"
      },
      {
        "slug": "e097874e-f945-4ff3-81bc-cf719bde464d.jpg",
        "alt": "e097874e-f945-4ff3-81bc-cf719bde464d",
        "order": "99"
      },
      {
        "slug": "54d16b4d-fdcd-4f3c-824d-5c9fd0f2a080.jpg",
        "alt": "54d16b4d-fdcd-4f3c-824d-5c9fd0f2a080",
        "order": "99"
      },
      {
        "slug": "70128af8-993e-4a30-8bbc-3f86cbefb50d.jpg",
        "alt": "70128af8-993e-4a30-8bbc-3f86cbefb50d",
        "order": "99"
      },
      {
        "slug": "cb4532ad-b343-4401-bbd2-ab67fe0d226a.jpg",
        "alt": "cb4532ad-b343-4401-bbd2-ab67fe0d226a",
        "order": "99"
      },
      {
        "slug": "13353d68-d2cc-4440-b3ca-eb0b71d38543.jpg",
        "alt": "13353d68-d2cc-4440-b3ca-eb0b71d38543",
        "order": "99"
      },
      {
        "slug": "f73d1156-9df9-45ae-b6b5-9616f95a0cf1.jpg",
        "alt": "f73d1156-9df9-45ae-b6b5-9616f95a0cf1",
        "order": "99"
      },
      {
        "slug": "d86b828c-b715-41e2-bd96-e71049107ba5.jpg",
        "alt": "d86b828c-b715-41e2-bd96-e71049107ba5",
        "order": "99"
      },
      {
        "slug": "b808e074-bb15-4d35-aad4-395fe8f21924.jpg",
        "alt": "b808e074-bb15-4d35-aad4-395fe8f21924",
        "order": "99"
      },
      {
        "slug": "490aefa5-a410-4d2a-a17b-52adf4cb4e92.jpg",
        "alt": "490aefa5-a410-4d2a-a17b-52adf4cb4e92",
        "order": "99"
      },
      {
        "slug": "be15b847-b352-41fa-92d4-e44d40212976.jpg",
        "alt": "be15b847-b352-41fa-92d4-e44d40212976",
        "order": "99"
      },
      {
        "slug": "aaa8ef78-d105-43e8-9d90-ceecd4e1f29d.jpg",
        "alt": "aaa8ef78-d105-43e8-9d90-ceecd4e1f29d",
        "order": "99"
      },
      {
        "slug": "6386d649-2415-4f35-a85a-75e16fb9bd9f.jpg",
        "alt": "6386d649-2415-4f35-a85a-75e16fb9bd9f",
        "order": "99"
      },
      {
        "slug": "4f99b011-18c7-4e06-bd7b-8fc663467784.jpg",
        "alt": "4f99b011-18c7-4e06-bd7b-8fc663467784",
        "order": "99"
      },
      {
        "slug": "fbc20e2b-8932-489a-a4cf-5af020dc12ea.jpg",
        "alt": "fbc20e2b-8932-489a-a4cf-5af020dc12ea",
        "order": "99"
      },
      {
        "slug": "6a224ec7-88c7-46eb-8ad5-2007540d7724.jpg",
        "alt": "6a224ec7-88c7-46eb-8ad5-2007540d7724",
        "order": "99"
      },
      {
        "slug": "4b5bd4a1-695c-4323-834c-44fd7facd936.jpg",
        "alt": "4b5bd4a1-695c-4323-834c-44fd7facd936",
        "order": "99"
      },
      {
        "slug": "a80fdc25-6f43-4e4b-a53e-2908178fdf7f.jpg",
        "alt": "a80fdc25-6f43-4e4b-a53e-2908178fdf7f",
        "order": "99"
      },
      {
        "slug": "83e08508-0a30-423f-9662-bc8afeeb410e.jpg",
        "alt": "83e08508-0a30-423f-9662-bc8afeeb410e",
        "order": "99"
      },
      {
        "slug": "b7298207-6837-473c-9c12-f91633f003f3.jpg",
        "alt": "b7298207-6837-473c-9c12-f91633f003f3",
        "order": "99"
      },
      {
        "slug": "1596ba4c-b918-4628-95be-300319cd0a11.jpg",
        "alt": "1596ba4c-b918-4628-95be-300319cd0a11"
      }
    ],
    "platform_specs": {
      "lin": {
        "rec": "<strong>RECOMMENDED:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Ubuntu 14.04 64-bit and newer recommended<br></li><li><strong>Processor:</strong> Intel® Core™ i5-4670K @3.4 GHz / AMD FX-8350 @4.0 GHz <br>\t</li><li><strong>Memory:</strong> 8 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> NVIDIA® GeForce® GTX 780 / AMD Radeon™ R9 290 (2GB VRAM)<br>       </li><li><strong>Additional Notes:</strong> JFS and XFS file systems are not supported</li></ul>",
        "min": "<strong>MINIMUM:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Ubuntu 14.04 64-bit and newer recommended<br></li><li><strong>Processor:</strong> Intel® Core™ i5-2500 @3.3 GHz / AMD FX-8320 @3.5 GHz<br></li><li><strong>Memory:</strong> 4 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> NVIDIA® GeForce® GTX 560 / AMD Radeon™ HD 6870 (1GB VRAM)<br>        </li><li><strong>Additional Notes:</strong> JFS and XFS file systems are not supported</li></ul>"
      },
      "mac": {
        "rec": "<strong>RECOMMENDED:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> macOS Sierra 10.12.1<br></li><li><strong>Processor:</strong> Intel® Core™ i7 @4.00GHz<br>\t</li><li><strong>Memory:</strong> 8 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> AMD Radeon™ R9 M395X (4GB VRAM)<br>    </li><li><strong>Additional Notes:</strong> Only AMD Radeon™ graphics cards are officially supported.</li></ul>",
        "min": "<strong>MINIMUM:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> macOS Sierra 10.12.1<br></li><li><strong>Processor:</strong> Intel® Core™ i5 @3.20GHz<br>    </li><li><strong>Memory:</strong> 4 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> AMD Radeon™ R9 M370X (2GB VRAM)<br>    </li><li><strong>Additional Notes:</strong> Only AMD Radeon™ graphics cards are officially supported.</li></ul>"
      },
      "win": {
        "rec": "<strong>RECOMMENDED:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows® 7 64-bit / Windows® 8 64-bit / Windows® 8.1 64-bit<br>\t</li><li><strong>Processor:</strong> Intel® Core™ i5-4670K @3.4 GHz / AMD FX-8350 @4.0 GHz <br>\t</li><li><strong>Memory:</strong> 8 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> NVIDIA® GeForce® GTX 780 / AMD Radeon™ R9 290 (2GB VRAM)<br>        </li><li><strong>DirectX®:</strong> Version 11<br>        </li><li><strong>Sound:</strong> DirectX® compatible<br>        </li><li><strong>Additional Notes:</strong> Laptop versions of graphics cards may work but are NOT officially supported.<br><br>Windows-compatible keyboard, mouse, optional controller (Xbox 360 Controller for Windows recommended)</li></ul>",
        "min": "<strong>MINIMUM:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows® 7 64-bit / Windows® 8 64-bit / Windows® 8.1 64-bit<br>\t</li><li><strong>Processor:</strong> Intel® Core™ i5-2500 @3.3 GHz / AMD FX-8320 @3.5 GHz<br>\t</li><li><strong>Memory:</strong> 4 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> NVIDIA® GeForce® GTX 560 / AMD Radeon™ HD 6870 (1GB VRAM)<br>        </li><li><strong>DirectX®:</strong> Version 11<br>        </li><li><strong>Sound:</strong> DirectX® compatible<br>        </li><li><strong>Additional Notes:</strong> Laptop versions of graphics cards may work but are NOT officially supported.<br><br>Windows-compatible keyboard, mouse, optional controller (Xbox 360 Controller for Windows recommended)</li></ul>"
      }
    },
    "visible": {
      "valid_until": null,
      "valid_from": "2018-06-01T14:00:00.000Z"
    },
    "availability": {
      "valid_until": null,
      "valid_from": "2020-10-28T16:00:00.000Z"
    },
    "video": [
      "0k-qmq-qX4s"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer",
      "Coop"
    ],
    "features": [
      "Steam Achievements",
      "Full controller support",
      "Steam Trading Cards",
      "Steam Workshop",
      "Steam Cloud",
      "Valve AntiCheat enabled",
      "Includes level editor"
    ],
    "developers": [
      "Techland"
    ],
    "publishers": [
      "Techland Publishing"
    ],
    "collections": [
      "Top Picks",
      "Hot Picks",
      "Bandai and Dying Light",
      "wishlist weekend",
      "horror games",
      "Story Rich Games"
    ],
    "franchises": [
      "Dying Light"
    ],
    "genres": [
      "Action",
      "RPG"
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish",
      "Dutch",
      "Polish",
      "Portuguese-Brazil",
      "Russian",
      "Korean",
      "Simplified Chinese"
    ],
    "release": "2018-05-29T09:03:47.142Z",
    "steam": {
      "packages": [],
      "dlc": [
        325724,
        335810,
        325723,
        347090,
        435111,
        436080,
        436081,
        436082,
        748340,
        748341,
        798540,
        798541,
        798542,
        798543
      ],
      "release": "2015-01-26T00:00:00.000Z",
      "id": 239140,
      "type": "app"
    },
    "price": {
      "JPY": 298000,
      "RUB": 264100,
      "AUD": 4795,
      "CAD": 3399,
      "EUR": 2999,
      "USD": 2999,
      "GBP": 2099
    },
    "platforms": {
      "linux": true,
      "mac": true,
      "windows": true
    },
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "age": {
      "ACB": 18,
      "USK": 0,
      "PEGI": 18,
      "ESRB": 17
    },
    "notice": {
      "legal": "DYING LIGHT © Techland 2015. Published and Distributed by Warner Bros. Home Entertainment Inc. WB SHIELD: ™ & © Warner Bros. Entertainment Inc."
    },
    "seo": {
      "desc": "Dying Light: The Following - Enhanced Edition takes parkour-fueled zombie survival to a whole new level. Enjoy the definitive Dying Light experience.",
      "title": "Dying Light: The Following – Enhanced Edition"
    },
    "quotes": [
      {
        "author": "Destructoid",
        "message": "\"The Following was larger than I expected, and it maintains a high level of quality throughout\"",
        "_id": "5b50e16fcab67e0017513275"
      },
      {
        "author": "ICXM",
        "message": "\"The thrill of rotting flesh, blood, guts and quite often my own tears has left me with an ironically refreshing outlook on what a game can be when it truly delivers\"",
        "_id": "5b50e16fcab67e0017513274"
      },
      {
        "author": "IGN Denmark",
        "message": "\"A solid combination of main game and expansion and a great place to start in the survival/horror genres\"",
        "_id": "5b50e16fcab67e0017513273"
      }
    ],
    "regions_included": [],
    "regions_excluded": [
      {
        "name": "Japan",
        "code": "JP",
        "_id": "5b129fc4c464ac00c71530de"
      },
      {
        "_id": "5d80ac3da6b73e007e81098c",
        "code": "RU",
        "name": "Russian Federation"
      },
      {
        "name": "Germany",
        "code": "DE",
        "_id": "60016bce494fd600857d3fb6"
      }
    ],
    "ubisoft_ska": false,
    "fullPrice": {
      "CAD": 5999,
      "USD": 5999,
      "EUR": 4999,
      "GBP": 3999,
      "AUD": 8149
    },
    "no_release_date": false,
    "no_release_date_text": null,
    "template_type": null,
    "artists": [],
    "authors": [],
    "downloads": [],
    "showReview": true,
    "catalina": true,
    "audit": [],
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "free_redeem_code": null,
    "hitcardVideo": "JxvWGYPY08UnWp8nY92QUoRLYpBL27CN4-480p.mp4",
    "parent_slug": "dying-light",
    "supplier_id": "55db244ad3b050fe108b45de",
    "currentPrice": {
      "JPY": 298000,
      "RUB": 264100,
      "AUD": 4795,
      "CAD": 3399,
      "EUR": 2999,
      "USD": 2999,
      "GBP": 2099
    },
    "current_discount": {
      "percent": 0,
      "display_percentage": false
    },
    "drm_string": "steam",
    "platforms_string": "linux,mac,windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "type": "game",
        "name": "Dying Light: Bad Blood",
        "slug": "dying-light-bad-blood",
        "cover": "be54fcc7-581f-498e-865e-8e3c226310cd.jpeg",
        "bundles": [],
        "price": {
          "JPY": 215700,
          "RUB": 163900,
          "AUD": 3089,
          "CAD": 2599,
          "EUR": 1999,
          "USD": 1999,
          "GBP": 1549
        },
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 172560,
          "RUB": 131120,
          "AUD": 2471,
          "CAD": 2079,
          "EUR": 1599,
          "USD": 1599,
          "GBP": 1239
        },
        "current_discount": {
          "percent": 0.2,
          "display_percentage": true,
          "until": "2021-09-22T15:59:00.000Z",
          "from": "2021-09-20T07:01:00.792Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Bad Blood"
      },
      {
        "type": "game",
        "name": "Dying Light: The Following – Enhanced Edition",
        "slug": "dying-light-enhanced-edition",
        "cover": "c2762fdd-8cb7-44a5-83f0-7da657a1f7f5.jpeg",
        "bundles": [],
        "price": {
          "JPY": 298000,
          "RUB": 264100,
          "AUD": 4795,
          "CAD": 3399,
          "EUR": 2999,
          "USD": 2999,
          "GBP": 2099
        },
        "platforms": {
          "linux": true,
          "mac": true,
          "windows": true
        },
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "fullPrice": {
          "CAD": 5999,
          "USD": 5999,
          "EUR": 4999,
          "GBP": 3999,
          "AUD": 8149
        },
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 298000,
          "RUB": 264100,
          "AUD": 4795,
          "CAD": 3399,
          "EUR": 2999,
          "USD": 2999,
          "GBP": 2099
        },
        "current_discount": {
          "percent": 0,
          "display_percentage": false
        },
        "drm_string": "steam",
        "platforms_string": "linux,mac,windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "The Following – Enhanced Edition"
      },
      {
        "bundles": [],
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "Dying Light - Platinum Edition",
        "platforms": {
          "linux": true,
          "mac": true,
          "windows": true
        },
        "price": {
          "JPY": 488000,
          "RUB": 438600,
          "AUD": 7795,
          "CAD": 5699,
          "EUR": 4999,
          "USD": 4999,
          "GBP": 3499
        },
        "slug": "dying-light-platinum-edition",
        "type": "game",
        "cover": "22ae3c59-9e66-4941-8763-f2e7c516c4ef.jpeg",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 488000,
          "RUB": 438600,
          "AUD": 7795,
          "CAD": 5699,
          "EUR": 4999,
          "USD": 4999,
          "GBP": 3499
        },
        "current_discount": {
          "percent": 0,
          "display_percentage": false
        },
        "drm_string": "steam",
        "platforms_string": "linux,mac,windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Platinum Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [
      "dying-light-crash-test-skin-bundle",
      "dying-light-vintage-gunslinger-bundle",
      "dying-light-gun-psycho-bundle",
      "dying-light-harran-ranger-bundle",
      "dying-light-volatile-hunter-bundle",
      "dying-light-white-death-bundle",
      "dying-light-rais-elite-bundle",
      "dying-light-godfather-bundle",
      "dying-light-shu-warrior-bundle",
      "dying-light-5-th-anniversary-bundle",
      "dying-light-volkan-combat-armor",
      "dying-light-retrowave-bundle",
      "dying-light-classified-operation-bundle",
      "dying-light-harran-tactical-unit",
      "dying-light-savvy-gamer-bundle",
      "dying-light-harran-inmate-bundle",
      "dying-light-astronaut-bundle",
      "dying-light-viking-raiders-of-harran",
      "dying-light-hellraid",
      "dying-light-the-following",
      "dying-light-season-pass"
    ],
    "edition_name": "The Following – Enhanced Edition",
    "recommendations": [
      "dying-light-the-following",
      "zombie-army-trilogy-4-pack",
      "metro-last-light-redux",
      "zombie-army-trilogy",
      "killing-floor",
      "warhammer-vermintide-2-collectors-edition",
      "zombie-driver-hd-complete-edition",
      "warhammer-vermintide-2",
      "how-to-survive-third-person-standalone",
      "payday-2",
      "deadrising-4",
      "zombie-night-terror",
      "dead-rising-2",
      "z-end",
      "deadrising-4-franks-big-package"
    ],
    "recommendations_challenger": [
      "dying-light-the-following",
      "dying-light-bad-blood",
      "zombie-army-trilogy-4-pack",
      "metro-last-light-redux",
      "zombie-army-trilogy",
      "killing-floor",
      "warhammer-vermintide-2-collectors-edition",
      "zombie-driver-hd-complete-edition",
      "warhammer-vermintide-2",
      "how-to-survive-third-person-standalone",
      "payday-2",
      "deadrising-4",
      "zombie-night-terror",
      "dead-rising-2",
      "z-end"
    ],
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "Game Informer",
        "message": "\"Tense and full of adrenaline-fueled moments, Dying Light is a blast\"",
        "url": "http://www.gameinformer.com/games/dying_light/b/xboxone/archive/2015/02/02/dying-light-game-informer-review.aspx",
        "displayScore": "8.5 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/gameinformer.jpg",
        "author": "Brian Shea"
      },
      {
        "scoreType": "text",
        "outletName": "IGN",
        "message": "\"High-speed parkour and gruesome zombie massacres make Dying Light a blast, even if the story's just okay.\"",
        "url": "http://www.ign.com/articles/2015/01/27/dying-light-review",
        "displayScore": "8.5 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/ign.jpg",
        "author": "Mikel Reparaz"
      },
      {
        "scoreType": "text",
        "outletName": "Eurogamer",
        "message": "\"As a follow up to Dead Island, Dying Light represents an improvement on the technical front, but has lost some of its knockabout charm in the process. It shares its predecessors pace and shape, as things start on a relative high as you explore into the game's systems, but then tail off the hours tick by. Dying Light mixes up Techland's own recipe to enjoyable effect, but can't fully disguise its regurgitated flavour.\"",
        "url": "http://www.eurogamer.net/articles/2015-01-30-dying-light-review",
        "displayScore": "7 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/eurogamer.jpg",
        "author": "Dan Whitehead"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/123/dying-light",
    "opencriticScoreString": "73% Fair",
    "opencriticReviewCount": 107,
    "opencriticPercentRecommended": 46,
    "openCriticScore": 73,
    "videos": [
      {
        "id": "tOzLTWfnhA0",
        "title": "Dying Light: The Following – Enhanced Edition Be The Zombie  Modders in DL infinite UV",
        "date": "2021-07-01T11:35:45Z",
        "thumbnail_url": "https://i.ytimg.com/vi/tOzLTWfnhA0/hqdefault.jpg"
      },
      {
        "id": "WfHPtIPDSog",
        "title": "Dying Light: The Following – Enhanced Edition",
        "date": "2018-12-06T05:45:23Z",
        "thumbnail_url": "https://i.ytimg.com/vi/WfHPtIPDSog/hqdefault.jpg"
      },
      {
        "id": "87SpyOMFN5c",
        "title": "Dying Light: The Following – Enhanced Edition randomness",
        "date": "2018-06-23T12:54:46Z",
        "thumbnail_url": "https://i.ytimg.com/vi/87SpyOMFN5c/hqdefault.jpg"
      },
      {
        "id": "ooq7Yiq_60w",
        "title": "Dying Light: The Following – Enhanced Edition gameplay",
        "date": "2017-06-17T03:34:35Z",
        "thumbnail_url": "https://i.ytimg.com/vi/ooq7Yiq_60w/hqdefault.jpg"
      },
      {
        "id": "hv0jQBH2GV0",
        "title": "Dying Light: The Following/Enhanced Edition/#07/ Harran Drift",
        "date": "2020-06-22T21:17:01Z",
        "thumbnail_url": "https://i.ytimg.com/vi/hv0jQBH2GV0/hqdefault.jpg"
      },
      {
        "id": "tQrlQ1Ttkso",
        "title": "Dying Light: The Following – Enhanced Edition",
        "date": "2016-07-13T05:59:56Z",
        "thumbnail_url": "https://i.ytimg.com/vi/tQrlQ1Ttkso/hqdefault.jpg"
      },
      {
        "id": "KINO0YtMX1o",
        "title": "Dying Light The Following  Enhanced Edition",
        "date": "2020-01-25T07:33:48Z",
        "thumbnail_url": "https://i.ytimg.com/vi/KINO0YtMX1o/hqdefault.jpg"
      },
      {
        "id": "95FZXCWOrqA",
        "title": "Dying Light: The Following – Enhanced Edition cj1",
        "date": "2017-10-14T17:09:00Z",
        "thumbnail_url": "https://i.ytimg.com/vi/95FZXCWOrqA/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "W9mK2hIAACkAJw3g",
        "uid": "steam-pc-games-to-play-on-halloween",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22W9mK2hIAACkAJw3g%22%29+%5D%5D",
        "tags": [
          "Alien: Isolation",
          "Alien: Isolation Collection",
          "Remothered: Tormented Fathers",
          "Origins Bundle",
          "Killing Floor 2",
          "Dying Light",
          "Dying Light - The Following: Enhanced Edition"
        ],
        "first_publication_date": "2018-10-31T16:31:46+0000",
        "last_publication_date": "2020-10-30T14:45:27+0000",
        "slugs": [
          "steam-pc-games-to-play-on-or-around-halloween",
          "steam-pc-games-to-play-on-halloween"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2020-10-26T17:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Steam PC games to play on or around Halloween",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/31143485-f50a-416f-98e4-b600a9876ca3_TheDarkPicturesAnthologyLittleHope_feat.jpg?auto=compress,format&rect=0,0,1280,720&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/31143485-f50a-416f-98e4-b600a9876ca3_TheDarkPicturesAnthologyLittleHope_feat.jpg?auto=compress,format&rect=0,0,1280,720&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/31143485-f50a-416f-98e4-b600a9876ca3_TheDarkPicturesAnthologyLittleHope_feat.jpg?auto=compress,format&rect=0,0,1280,720&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/31143485-f50a-416f-98e4-b600a9876ca3_TheDarkPicturesAnthologyLittleHope_feat.jpg?auto=compress,format&rect=0,0,1280,720&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "PC games for the spooks and thrills of Halloween",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "WlOWNisAACgAmSYW",
        "uid": "best-zombie-pc-games-our-top-picks",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22WlOWNisAACgAmSYW%22%29+%5D%5D",
        "tags": [
          "zombies",
          "Steam PC",
          "Dead Island",
          "Dead Effect",
          "Resident Evil",
          "State of Decay",
          "Zombie Army Trilogy",
          "Dying Light",
          "Resident Evil 2"
        ],
        "first_publication_date": "2018-01-08T17:23:31+0000",
        "last_publication_date": "2021-08-13T11:24:07+0000",
        "slugs": [
          "the-best-zombie-steam-pc-games---our-top-picks",
          "top-zombie-steam-pc-games---our-top-picks",
          "best-zombie-steam-pc-games---our-top-picks",
          "best-zombie-pc-games---our-top-picks"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2020-03-27T08:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "The best zombie Steam PC games - Our top picks",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/c5148ebf-2306-4f42-8ee9-7b9a191e054b_ss_ef618256720e6e665f4b8b5dd11726a561e0b16e.1920x1080.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/c5148ebf-2306-4f42-8ee9-7b9a191e054b_ss_ef618256720e6e665f4b8b5dd11726a561e0b16e.1920x1080.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/c5148ebf-2306-4f42-8ee9-7b9a191e054b_ss_ef618256720e6e665f4b8b5dd11726a561e0b16e.1920x1080.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/c5148ebf-2306-4f42-8ee9-7b9a191e054b_ss_ef618256720e6e665f4b8b5dd11726a561e0b16e.1920x1080.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "We're undead-cided about some, but here are our top Steam PC choices",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": [
        {
          "_id": "612de7f58c172940e1cf98b1",
          "slug": "dying-light-enhanced-edition",
          "rating": 5,
          "display_name": "Sam Jones",
          "title": "Dying Light: The Following – Enhanced Edition Review",
          "text": "Just when we thought Dying Light had blown us away with its gripping parkour, awesome combat and engaging city - Techland proved there's more to this action RPG. Travel further, explore hidden storylines and get yourself behind the wheel of fun dirt buggy which not only helps players see the rest of this game's impressive world, but also doubles up as a great way to turn zombies into mush!",
          "date": "2021-08-31T08:27:33.237Z",
          "staff_review": true,
          "recommended": true,
          "likes": 2,
          "locale": "en",
          "product_id": "5b0d1785ce00e67512dfc8c4",
          "version_id": "612de7f58c172940e1cf98b0",
          "published": true,
          "has_active_version": true
        },
        {
          "_id": "61303589e5364e1c8359aa1b",
          "slug": "dying-light-enhanced-edition",
          "rating": 3,
          "display_name": "Savvym",
          "title": "Dumb and dangerous zombies, parkour, FPS, story driven",
          "text": "Filled with good cutscenes and stories. People act real, zombies are dumb and dangerous, night is intimidating. Loot places in buses and houses are sometimes the same. RPG abilities are great. You make new moves, craft improved things, become stronger and get survival bonuses. \n\nI was initially impressed and really liked the parkour but got tired of killing never-ending hordes of enemies.\n\nThe weapons also get damaged so fast, it goes into realism maybe a bit too much. It's also a tough survival.\n\nNight can be scary at first and it certainly fills us with tension but again, it gets frustrating if you play your single player missions online and some player spawns as a zombie and hunts you while you're not ready to face him off because this is more like a random encounter.\n\nI was let down by this experience and also tired of doing the same while very slowly progressing in the story that's only half decent. The world is beautiful but areas are small and the fun dies early on.",
          "date": "2021-09-02T02:29:53.620Z",
          "staff_review": false,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "5b0d1785ce00e67512dfc8c4",
          "version_id": "6130372116414a009dd2cf94",
          "published": true,
          "has_active_version": true,
          "removed": false
        }
      ]
    },
    "relatedHits": [
      {
        "product_id": "611b948da473d40076128213",
        "sku": "PCD20739",
        "name": "Dying Light - Astronaut Bundle",
        "slug": "dying-light-astronaut-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "d566065e-e0e5-4581-aa96-c9bd7180c3ae.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 259,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 259,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "rP4lyndbUdc"
        ],
        "available_valid_from": 1629306000,
        "available_valid_until": 32535216000,
        "release_date": 1629306000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "ce66c2fd-2451-49d7-9195-c0e9f271e1d3.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-240p.webm"
          }
        ],
        "video_clip_poster": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-poster.jpg",
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5360536002"
      },
      {
        "product_id": "5f0eb892e5364e1c834ee98d",
        "sku": "PCD15990",
        "name": "Dying Light - Hellraid",
        "slug": "dying-light-hellraid",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "d68adedc-4320-4623-a867-54a00a3b9db3.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 6.99,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 13.49,
          "AUD": 15.5,
          "RUB": 835,
          "JPY": 980
        },
        "fullPrice": {
          "GBP": 6.99,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 13.49,
          "AUD": 15.5,
          "RUB": 835,
          "JPY": 980
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "6I7qnv3syzw",
          "k3QKG9k2a68"
        ],
        "available_valid_from": 1594767600,
        "available_valid_until": 32535216000,
        "release_date": 1597338000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "61a4f48b-ee06-4267-aaba-20406954ffa9.png",
          "a6fc1140-68f2-4d4f-864e-4a927d6c8338.png",
          "178c96bd-77b8-44b6-8df9-8232fb87db6b.png",
          "72196fc9-b8d0-4474-a1f4-41a5a00c200b.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-240p.webm"
          }
        ],
        "video_clip_poster": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-poster.jpg",
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5354402002"
      },
      {
        "product_id": "5f7446c2e5364e1c83efa0df",
        "sku": "PCD16900",
        "name": "Dying Light - Volkan Combat Armor",
        "slug": "dying-light-volkan-combat-armor",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "cb97680c-774b-44eb-b876-2f2f47466b3c.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1601643600,
        "available_valid_until": 32535216000,
        "release_date": 1601643600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "2d0d6888-4019-43a5-af15-88d6d610a8f0.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5355538002"
      },
      {
        "product_id": "6023ea35c477920085e243c3",
        "sku": "PCD18243",
        "name": "Dying Light - Viking: Raiders of Harran",
        "slug": "dying-light-viking-raiders-of-harran",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "088d6a85-677c-439a-8a92-1a565584dbc3.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.89,
          "EUR": 3.99,
          "USD": 3.99,
          "CAD": 4.65,
          "AUD": 5.95,
          "RUB": 348,
          "JPY": 398
        },
        "fullPrice": {
          "GBP": 2.89,
          "EUR": 3.99,
          "USD": 3.99,
          "CAD": 4.65,
          "AUD": 5.95,
          "RUB": 348,
          "JPY": 398
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "EGj_9kMhpaY"
        ],
        "available_valid_from": 1613055600,
        "available_valid_until": 32535216000,
        "release_date": 1613055600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "1257da9f-44ee-4293-8671-8a559276c7dc.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-240p.webm"
          }
        ],
        "video_clip_poster": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-poster.jpg",
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5357252002"
      },
      {
        "product_id": "603631750d3184007e259f4d",
        "sku": "PCD18391",
        "name": "Dying Light - Harran Tactical Unit",
        "slug": "dying-light-harran-tactical-unit",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "5090c0e2-ec4d-43a8-8ecd-1eb535525c24.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 260,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 260,
          "JPY": 310
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "yhQi0HL_lnw"
        ],
        "available_valid_from": 1614276000,
        "available_valid_until": 32535216000,
        "release_date": 1614254400,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "773b3112-36fc-4467-9993-5db35a50340d.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5357435002"
      },
      {
        "product_id": "5e4ea3f0e5364e1c8355e1c9",
        "sku": "PCD14293",
        "name": "Dying Light - 5th Anniversary Bundle",
        "slug": "dying-light-5-th-anniversary-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "73b1001a-6cc8-4156-8489-b8da7a75521b.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 225,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 225,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1582221600,
        "available_valid_until": 32535216000,
        "release_date": 1582156800,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "a4b1316a-bd77-4850-bbb6-00c37f337337.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5352268002"
      },
      {
        "product_id": "5b190e84ce00e67512dfe56c",
        "sku": "PCD9280",
        "name": "Dying Light Season Pass DLC",
        "slug": "dying-light-season-pass",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "b9caf323-952f-4b00-9575-68a2e097c5ae.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 17.99,
          "EUR": 24.99,
          "USD": 24.99,
          "CAD": 29.99,
          "AUD": 42.95,
          "RUB": 1899,
          "JPY": 2480
        },
        "fullPrice": {
          "GBP": 17.99,
          "EUR": 24.99,
          "USD": 24.99,
          "CAD": 29.99,
          "AUD": 42.95,
          "RUB": 1899,
          "JPY": 2480
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [
          "Bandai and Dying Light"
        ],
        "video": [
          "s9ajnBRu09g"
        ],
        "available_valid_from": 1528368771,
        "available_valid_until": 32535216000,
        "release_date": 1422316800,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "c96dfb83-236c-44a2-b874-a64c33945cbb.jpg",
          "ff9c82a0-a424-4369-93e7-268dff5f142c.jpg",
          "7f212cb6-f721-4aac-9d96-abe83919dfd8.jpg",
          "d85bfb34-2f52-4a24-939e-b7e906afb178.jpg",
          "aa205829-5a43-4664-81bb-d4f2b3b76df4.jpg",
          "c50290f5-7a50-4339-b143-1dbfa3c0cdff.jpg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 0,
          "ESRB": 0
        },
        "objectID": "5346313002"
      },
      {
        "product_id": "60d30da271238a01f6ee90b4",
        "sku": "PCD19869",
        "name": "Dying Light - Savvy Gamer Bundle",
        "slug": "dying-light-savvy-gamer-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "cc6c400e-fb88-4ba2-8fa2-4339db262235.jpeg",
        "tiered": false,
        "discount_percent": 15,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.77,
          "EUR": 2.54,
          "USD": 2.54,
          "CAD": 2.88,
          "AUD": 3.82,
          "RUB": 217.6,
          "JPY": 263.5
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 256,
          "JPY": 310
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1632121260,
        "available_valid_until": 1632326340,
        "release_date": 1624554000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "36cf7f0d-9acf-4026-8c59-a48cdfd7cbd5.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5359459002"
      },
      {
        "product_id": "5fc90ca173af4a007e93e253",
        "sku": "PCD17671",
        "name": "Dying Light - Classified Operation Bundle",
        "slug": "dying-light-classified-operation-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "3e01ed63-59d2-4d93-b97a-2ee41e73dbaa.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 263,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 263,
          "JPY": 310
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "5nZRKRs_NpQ"
        ],
        "available_valid_from": 1607011324,
        "available_valid_until": 32535216000,
        "release_date": 1606953600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "d3aec117-8d90-411a-8a54-2369b725b5b7.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5356609002"
      },
      {
        "product_id": "5d6d2c5d2c9b138168f3aa6d",
        "sku": "PCD12803",
        "name": "Dying Light - Rais Elite Bundle",
        "slug": "dying-light-rais-elite-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "01ff25cf-f645-40c8-a7ac-659b1e13be43.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 235,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 235,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "O9_BJbfeF7M"
        ],
        "available_valid_from": 1567378800,
        "available_valid_until": 32535216000,
        "release_date": 1566864000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "d0deb0ce-2482-4b44-b27b-50c08a34e224.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5350585002"
      },
      {
        "product_id": "5b1116afce00e67512dfd628",
        "sku": "PCD9239",
        "name": "Dying Light: The Following DLC",
        "slug": "dying-light-the-following",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "6b0443d0-4b86-4ed3-bff8-db20c4905c90.jpeg",
        "tiered": false,
        "discount_percent": 16,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 13.5,
          "EUR": 16.88,
          "USD": 16.88,
          "CAD": 16.88,
          "AUD": 22.8,
          "RUB": 1097.52,
          "JPY": 1822.44
        },
        "fullPrice": {
          "GBP": 15.99,
          "EUR": 19.99,
          "USD": 19.99,
          "CAD": 19.99,
          "AUD": 26.99,
          "RUB": 1299,
          "JPY": 2157
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [
          "Bandai and Dying Light"
        ],
        "video": [
          "8B_ldti4QGI"
        ],
        "available_valid_from": 1632034860,
        "available_valid_until": 1632239940,
        "release_date": 1454889600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "595ad72e-ae96-44d2-b6fa-2aca8ec15c15.jpg",
          "f530c3af-689d-4526-8560-fbeace3e44f3.jpg",
          "7055052c-68c2-4621-b93f-8ec4de5e7cf3.jpg",
          "fa2d2300-0878-48ee-b7a6-7eca7f1764ac.jpg",
          "f0ed2b58-7836-436f-8922-566e493bdc5c.jpg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 0,
          "ESRB": 0
        },
        "objectID": "5346251002"
      },
      {
        "product_id": "5d8b6ed2e5364e1c832f29ff",
        "sku": "PCD12985",
        "name": "Dying Light:  Godfather Bundle",
        "slug": "dying-light-godfather-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "501ed284-a701-4f7b-9eb0-4ca59b09025e.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 225,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 225,
          "JPY": 310
        },
        "operating_systems": [],
        "drm": [
          "steam"
        ],
        "features": [],
        "collections": [],
        "video": [],
        "available_valid_from": 1570114800,
        "available_valid_until": 32535216000,
        "release_date": 1570057200,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "2737889b-ea3a-4abe-8251-887b703eeaf3.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "ESRB": 17,
          "PEGI": 18
        },
        "objectID": "5350795002"
      },
      {
        "product_id": "5e2978ffe5364e1c8332a1b4",
        "sku": "PCD14050",
        "name": "Dying Light - Shu Warrior Bundle",
        "slug": "dying-light-shu-warrior-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "a25b9ee4-626f-4139-9634-8ffd9a5ffc6a.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 218,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 218,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1579788000,
        "available_valid_until": 32535216000,
        "release_date": 1566864000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "ef536f3c-7f45-4de8-b345-eb04866d0a6b.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5352105002"
      },
      {
        "product_id": "5d7f620de5364e1c832516a2",
        "sku": "PCD12930",
        "name": "Dying Light - Harran Ranger Bundle",
        "slug": "dying-light-harran-ranger-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "77b87da1-e42a-4e24-a0f5-62cd8e2336c2.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "fzWZ2EqkOWY"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1461024000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "34bf6afa-7ffc-48bd-9b23-88a75bccfddb.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 0,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5350745002"
      },
      {
        "product_id": "5d7f6211e5364e1c83251754",
        "sku": "PCD12931",
        "name": "Dying Light - Volatile Hunter Bundle",
        "slug": "dying-light-volatile-hunter-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "5f34d5b2-cd19-4768-8e53-e5d1caffe2bf.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "ogfBsuq3azg"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1461024000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "8c77120a-6764-40f1-b062-3b449a681f78.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 0,
          "ESRB": 0
        },
        "objectID": "5350746002"
      },
      {
        "product_id": "5bf68dc8618657020cccc5ae",
        "sku": "PCD10456",
        "name": "Dying Light - Vintage Gunslinger Bundle",
        "slug": "dying-light-vintage-gunslinger-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "19a84cbc-7705-48da-b15f-c623f78909ce.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 231,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 231,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "u6WLqhyWg98"
        ],
        "available_valid_from": 1542988800,
        "available_valid_until": 32535216000,
        "release_date": 1513641600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "dcbee51e-a929-43df-a5e4-e6ed881aea48.jpg"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-240p.webm"
          }
        ],
        "video_clip_poster": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-poster.jpg",
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5347947002"
      },
      {
        "product_id": "5d7f620ae5364e1c832515e7",
        "sku": "PCD12929",
        "name": "Dying Light - Gun Psycho Bundle",
        "slug": "dying-light-gun-psycho-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "4f454a03-6f9b-4340-92be-493dcfefe781.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "Q2s527JP4t0"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1461024000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "fcc93abd-6579-4e5d-978b-4a7bb4c7965a.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-240p.webm"
          }
        ],
        "video_clip_poster": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-poster.jpg",
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 0,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5350744002"
      },
      {
        "product_id": "5d7f6214e5364e1c832517fc",
        "sku": "PCD12932",
        "name": "Dying Light - White Death Bundle",
        "slug": "dying-light-white-death-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "29b10b46-a797-4d25-bf05-20f8f4fe0de5.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "i5Lb5w5fnh0"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1513641600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5350747002"
      },
      {
        "product_id": "5f96edee01b6d900850da64e",
        "sku": "PCD17221",
        "name": "Dying Light - Retrowave Bundle",
        "slug": "dying-light-retrowave-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "e9976fdf-f07b-4a34-8ab5-a9faeb03bd3a.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 268,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 268,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "EkGEL0OwuH8"
        ],
        "available_valid_from": 1603726599,
        "available_valid_until": 32535216000,
        "release_date": 1576713600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "a83dbab1-fecc-4ea3-903a-68d936b30e2a.jpeg"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-240p.webm"
          }
        ],
        "video_clip_poster": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-poster.jpg",
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5356025002"
      },
      {
        "product_id": "5d7f6205e5364e1c832514fb",
        "sku": "PCD12928",
        "name": "Dying Light - Crash Test Skin Bundle",
        "slug": "dying-light-crash-test-skin-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "a534f988-f2af-4f7a-9f55-db3a6081c643.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.59,
          "EUR": 1.99,
          "USD": 1.99,
          "CAD": 1.99,
          "AUD": 2.95,
          "RUB": 151,
          "JPY": 198
        },
        "fullPrice": {
          "GBP": 1.59,
          "EUR": 1.99,
          "USD": 1.99,
          "CAD": 1.99,
          "AUD": 2.95,
          "RUB": 151,
          "JPY": 198
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "K3IBekUYhB4"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1461024000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "80b4beae-a8b1-4ca0-a08e-72f3d7360aae.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 0,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5350743002"
      },
      {
        "product_id": "60f82d89e6b7be007d6d3883",
        "sku": "PCD20376",
        "name": "Dying Light - Harran Inmate Bundle",
        "slug": "dying-light-harran-inmate-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "d474edbf-1759-4a94-9a46-6952d182263c.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 262,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 262,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1626877075,
        "available_valid_until": 32535216000,
        "release_date": 1574726400,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "83ec90a1-d3a3-4ee8-bcec-afeb78bec8ef.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5360053002"
      }
    ],
    "userReviewSummary": {
      "rating_score": 4.2,
      "total_ratings": 5,
      "percent_recommended": 67,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 20,
        "four_star_percentage": 40,
        "five_star_percentage": 40
      },
      "reviewLocales": [
        "en"
      ],
      "total_written_reviews": 2
    }
  },
  {
    "_id": "5d961273e5364e1c83e37378",
    "__v": 14,
    "age": {
      "ACB": 0,
      "USK": 0,
      "PEGI": 0,
      "ESRB": 0
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_until": null,
      "valid_from": "2019-10-02T23:00:00.000Z"
    },
    "bundles": [],
    "collections": [],
    "developers": [
      "Sloclap"
    ],
    "display_type": "game",
    "drm": {
      "drm_free": false,
      "steam": true,
      "origin": false,
      "rockstar": false,
      "esonline": false,
      "uplay": false,
      "oculus": false,
      "bethesda": false,
      "epicgames": false,
      "switch": false,
      "threeds": false
    },
    "features": [
      "Online Multi-Player",
      "Online Co-op",
      "Steam Achievements",
      "Full controller support"
    ],
    "franchises": [],
    "genres": [
      "Action",
      "Adventure",
      "Indie"
    ],
    "img": [
      {
        "slug": "c3a9e5a8-5aef-4a95-820b-3274e8601e67.png",
        "alt": "c3a9e5a8-5aef-4a95-820b-3274e8601e67.png"
      },
      {
        "slug": "609affe7-34c3-471b-b51d-a4bac874baa8.png",
        "alt": "609affe7-34c3-471b-b51d-a4bac874baa8.png"
      },
      {
        "slug": "8c457582-6c0a-4cdd-9e49-0125aa4ccfef.png",
        "alt": "8c457582-6c0a-4cdd-9e49-0125aa4ccfef.png"
      },
      {
        "slug": "cd530a82-9928-43a0-ac2e-499db007e673.png",
        "alt": "cd530a82-9928-43a0-ac2e-499db007e673.png"
      },
      {
        "slug": "91500970-8d28-4234-bebc-dafe3e2ce2f6.png",
        "alt": "91500970-8d28-4234-bebc-dafe3e2ce2f6.png"
      },
      {
        "slug": "8289cab9-0981-4188-9263-085f966d6f33.png",
        "alt": "8289cab9-0981-4188-9263-085f966d6f33.png"
      },
      {
        "slug": "060c8f25-e8e8-42e5-aedc-854a0150d237.png",
        "alt": "060c8f25-e8e8-42e5-aedc-854a0150d237.png"
      }
    ],
    "lang": [
      "English",
      "French",
      "German",
      "Spanish - Spain",
      "Polish",
      "Portuguese - Brazil",
      "Russian",
      "Japanese"
    ],
    "modes": [
      "Single-player"
    ],
    "name": "Absolver",
    "notice": {
      "legal": "Copyright Sloclap 2017. All Rights Reserved."
    },
    "platform_specs": {
      "win": {
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows 7/8/8.1/10 x64<br></li><li><strong>Processor:</strong> Intel Core i5-4670K (4*3400) or equivalent / AMD FX-8320 (8 * 3500) or equivalent<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> GeForce GTX 960 (4096 MB) / Radeon R9 380 (2048 MB) or better<br></li><li><strong>DirectX:</strong> Version 9.0<br></li><li><strong>Network:</strong> Broadband Internet connection<br></li><li><strong>Storage:</strong> 11 GB available space<br></li><li><strong>Additional Notes:</strong> Gamepad strongly recommended.</li></ul>",
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows 7/8/8.1/10 x64<br></li><li><strong>Processor:</strong> Intel Core i7-950 (4 * 3000) or equivalent /  AMD Phenom II X4 965 (4 * 3400) or equivalent<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> GeForce GTX 480 (1536 MB) / Radeon HD 7850 (2048 MB)<br></li><li><strong>DirectX:</strong> Version 9.0<br></li><li><strong>Network:</strong> Broadband Internet connection<br></li><li><strong>Storage:</strong> 11 GB available space<br></li><li><strong>Additional Notes:</strong> Gamepad strongly recommended.</li></ul>"
      }
    },
    "platforms": {
      "windows": true,
      "mac": false,
      "linux": false
    },
    "price": {
      "JPY": 323600,
      "GBP": 2499,
      "USD": 2999,
      "EUR": 2999,
      "CAD": 3299,
      "AUD": 4295,
      "RUB": 230700
    },
    "publishers": [
      "Devolver Digital"
    ],
    "quotes": [],
    "regions_excluded": [],
    "regions_included": [
      {
        "_id": "5d53d2c42be8a40085b689e3",
        "code": "AF",
        "name": "Afghanistan"
      },
      {
        "_id": "5d53d2c42be8a40085b689e2",
        "code": "AX",
        "name": "Åland Islands"
      },
      {
        "_id": "5d53d2c42be8a40085b689e1",
        "code": "AL",
        "name": "Albania"
      },
      {
        "_id": "5d53d2c42be8a40085b689e0",
        "code": "DZ",
        "name": "Algeria"
      },
      {
        "_id": "5d53d2c42be8a40085b689df",
        "code": "AS",
        "name": "American Samoa"
      },
      {
        "_id": "5d53d2c42be8a40085b689de",
        "code": "AD",
        "name": "Andorra"
      },
      {
        "_id": "5d53d2c42be8a40085b689dd",
        "code": "AO",
        "name": "Angola"
      },
      {
        "_id": "5d53d2c42be8a40085b689dc",
        "code": "AI",
        "name": "Anguilla"
      },
      {
        "_id": "5d53d2c42be8a40085b689db",
        "code": "AQ",
        "name": "Antarctica"
      },
      {
        "_id": "5d53d2c42be8a40085b689da",
        "code": "AG",
        "name": "Antigua and Barbuda"
      },
      {
        "_id": "5d53d2c42be8a40085b689d9",
        "code": "AR",
        "name": "Argentina"
      },
      {
        "_id": "5d53d2c42be8a40085b689d8",
        "code": "AM",
        "name": "Armenia"
      },
      {
        "_id": "5d53d2c42be8a40085b689d7",
        "code": "AW",
        "name": "Aruba"
      },
      {
        "_id": "5d53d2c42be8a40085b689d6",
        "code": "AU",
        "name": "Australia"
      },
      {
        "_id": "5d53d2c42be8a40085b689d5",
        "code": "AT",
        "name": "Austria"
      },
      {
        "_id": "5d53d2c42be8a40085b689d4",
        "code": "AZ",
        "name": "Azerbaijan"
      },
      {
        "_id": "5d53d2c42be8a40085b689d3",
        "code": "BS",
        "name": "Bahamas"
      },
      {
        "_id": "5d53d2c42be8a40085b689d2",
        "code": "BH",
        "name": "Bahrain"
      },
      {
        "_id": "5d53d2c42be8a40085b689d1",
        "code": "BD",
        "name": "Bangladesh"
      },
      {
        "_id": "5d53d2c42be8a40085b689d0",
        "code": "BB",
        "name": "Barbados"
      },
      {
        "_id": "5d53d2c42be8a40085b689cf",
        "code": "BY",
        "name": "Belarus"
      },
      {
        "_id": "5d53d2c42be8a40085b689ce",
        "code": "BE",
        "name": "Belgium"
      },
      {
        "_id": "5d53d2c42be8a40085b689cd",
        "code": "BZ",
        "name": "Belize"
      },
      {
        "_id": "5d53d2c42be8a40085b689cc",
        "code": "BJ",
        "name": "Benin"
      },
      {
        "_id": "5d53d2c42be8a40085b689cb",
        "code": "BM",
        "name": "Bermuda"
      },
      {
        "_id": "5d53d2c42be8a40085b689ca",
        "code": "BT",
        "name": "Bhutan"
      },
      {
        "_id": "5d53d2c42be8a40085b689c9",
        "code": "BO",
        "name": "Bolivia, Plurinational State of"
      },
      {
        "_id": "5d53d2c42be8a40085b689c8",
        "code": "BQ",
        "name": "Bonaire, Sint Eustatius and Saba"
      },
      {
        "_id": "5d53d2c42be8a40085b689c7",
        "code": "BA",
        "name": "Bosnia and Herzegovina"
      },
      {
        "_id": "5d53d2c42be8a40085b689c6",
        "code": "BW",
        "name": "Botswana"
      },
      {
        "_id": "5d53d2c42be8a40085b689c5",
        "code": "BV",
        "name": "Bouvet Island"
      },
      {
        "_id": "5d53d2c42be8a40085b689c4",
        "code": "BR",
        "name": "Brazil"
      },
      {
        "_id": "5d53d2c42be8a40085b689c3",
        "code": "IO",
        "name": "British Indian Ocean Territory"
      },
      {
        "_id": "5d53d2c42be8a40085b689c2",
        "code": "BN",
        "name": "Brunei Darussalam"
      },
      {
        "_id": "5d53d2c42be8a40085b689c1",
        "code": "BG",
        "name": "Bulgaria"
      },
      {
        "_id": "5d53d2c42be8a40085b689c0",
        "code": "BF",
        "name": "Burkina Faso"
      },
      {
        "_id": "5d53d2c42be8a40085b689bf",
        "code": "BI",
        "name": "Burundi"
      },
      {
        "_id": "5d53d2c42be8a40085b689be",
        "code": "KH",
        "name": "Cambodia"
      },
      {
        "_id": "5d53d2c42be8a40085b689bd",
        "code": "CM",
        "name": "Cameroon"
      },
      {
        "_id": "5d53d2c42be8a40085b689bc",
        "code": "CA",
        "name": "Canada"
      },
      {
        "_id": "5d53d2c42be8a40085b689bb",
        "code": "CV",
        "name": "Cape Verde"
      },
      {
        "_id": "5d53d2c42be8a40085b689ba",
        "code": "KY",
        "name": "Cayman Islands"
      },
      {
        "_id": "5d53d2c42be8a40085b689b9",
        "code": "CF",
        "name": "Central African Republic"
      },
      {
        "_id": "5d53d2c42be8a40085b689b8",
        "code": "TD",
        "name": "Chad"
      },
      {
        "_id": "5d53d2c42be8a40085b689b7",
        "code": "CL",
        "name": "Chile"
      },
      {
        "_id": "5d53d2c42be8a40085b689b6",
        "code": "CN",
        "name": "China"
      },
      {
        "_id": "5d53d2c42be8a40085b689b5",
        "code": "CX",
        "name": "Christmas Island"
      },
      {
        "_id": "5d53d2c42be8a40085b689b4",
        "code": "CC",
        "name": "Cocos (Keeling) Islands"
      },
      {
        "_id": "5d53d2c42be8a40085b689b3",
        "code": "CO",
        "name": "Colombia"
      },
      {
        "_id": "5d53d2c42be8a40085b689b2",
        "code": "KM",
        "name": "Comoros"
      },
      {
        "_id": "5d53d2c42be8a40085b689b1",
        "code": "CG",
        "name": "Congo"
      },
      {
        "_id": "5d53d2c42be8a40085b689b0",
        "code": "CK",
        "name": "Cook Islands"
      },
      {
        "_id": "5d53d2c42be8a40085b689af",
        "code": "CR",
        "name": "Costa Rica"
      },
      {
        "_id": "5d53d2c42be8a40085b689ae",
        "code": "CI",
        "name": "Côte d'Ivoire"
      },
      {
        "_id": "5d53d2c42be8a40085b689ad",
        "code": "HR",
        "name": "Croatia"
      },
      {
        "_id": "5d53d2c42be8a40085b689ac",
        "code": "CU",
        "name": "Cuba"
      },
      {
        "_id": "5d53d2c42be8a40085b689ab",
        "code": "CW",
        "name": "Curaçao"
      },
      {
        "_id": "5d53d2c42be8a40085b689aa",
        "code": "CY",
        "name": "Cyprus"
      },
      {
        "_id": "5d53d2c42be8a40085b689a9",
        "code": "CZ",
        "name": "Czech Republic"
      },
      {
        "_id": "5d53d2c42be8a40085b689a8",
        "code": "DK",
        "name": "Denmark"
      },
      {
        "_id": "5d53d2c42be8a40085b689a7",
        "code": "DJ",
        "name": "Djibouti"
      },
      {
        "_id": "5d53d2c42be8a40085b689a6",
        "code": "DM",
        "name": "Dominica"
      },
      {
        "_id": "5d53d2c42be8a40085b689a5",
        "code": "DO",
        "name": "Dominican Republic"
      },
      {
        "_id": "5d53d2c42be8a40085b689a4",
        "code": "EC",
        "name": "Ecuador"
      },
      {
        "_id": "5d53d2c42be8a40085b689a3",
        "code": "EG",
        "name": "Egypt"
      },
      {
        "_id": "5d53d2c42be8a40085b689a2",
        "code": "SV",
        "name": "El Salvador"
      },
      {
        "_id": "5d53d2c42be8a40085b689a1",
        "code": "GQ",
        "name": "Equatorial Guinea"
      },
      {
        "_id": "5d53d2c42be8a40085b689a0",
        "code": "ER",
        "name": "Eritrea"
      },
      {
        "_id": "5d53d2c42be8a40085b6899f",
        "code": "EE",
        "name": "Estonia"
      },
      {
        "_id": "5d53d2c42be8a40085b6899e",
        "code": "ET",
        "name": "Ethiopia"
      },
      {
        "_id": "5d53d2c42be8a40085b6899d",
        "code": "FK",
        "name": "Falkland Islands (Malvinas)"
      },
      {
        "_id": "5d53d2c42be8a40085b6899c",
        "code": "FO",
        "name": "Faroe Islands"
      },
      {
        "_id": "5d53d2c42be8a40085b6899b",
        "code": "FJ",
        "name": "Fiji"
      },
      {
        "_id": "5d53d2c42be8a40085b6899a",
        "code": "FI",
        "name": "Finland"
      },
      {
        "_id": "5d53d2c42be8a40085b68999",
        "code": "FR",
        "name": "France"
      },
      {
        "_id": "5d53d2c42be8a40085b68998",
        "code": "GF",
        "name": "French Guiana"
      },
      {
        "_id": "5d53d2c42be8a40085b68997",
        "code": "PF",
        "name": "French Polynesia"
      },
      {
        "_id": "5d53d2c42be8a40085b68996",
        "code": "TF",
        "name": "French Southern Territories"
      },
      {
        "_id": "5d53d2c42be8a40085b68995",
        "code": "GA",
        "name": "Gabon"
      },
      {
        "_id": "5d53d2c42be8a40085b68994",
        "code": "GM",
        "name": "Gambia"
      },
      {
        "_id": "5d53d2c42be8a40085b68993",
        "code": "GE",
        "name": "Georgia"
      },
      {
        "_id": "5d53d2c42be8a40085b68992",
        "code": "DE",
        "name": "Germany"
      },
      {
        "_id": "5d53d2c42be8a40085b68991",
        "code": "GH",
        "name": "Ghana"
      },
      {
        "name": "Gibraltar",
        "code": "GI",
        "_id": "5d53d3cb3587ab007e7b8dcd"
      },
      {
        "name": "Greece",
        "code": "GR",
        "_id": "5d53d3cb3587ab007e7b8dcc"
      },
      {
        "name": "Greenland",
        "code": "GL",
        "_id": "5d53d3cb3587ab007e7b8dcb"
      },
      {
        "name": "Grenada",
        "code": "GD",
        "_id": "5d53d3cb3587ab007e7b8dca"
      },
      {
        "name": "Guadeloupe",
        "code": "GP",
        "_id": "5d53d3cb3587ab007e7b8dc9"
      },
      {
        "name": "Guam",
        "code": "GU",
        "_id": "5d53d3cb3587ab007e7b8dc8"
      },
      {
        "name": "Guatemala",
        "code": "GT",
        "_id": "5d53d3cb3587ab007e7b8dc7"
      },
      {
        "name": "Guernsey",
        "code": "GG",
        "_id": "5d53d3cb3587ab007e7b8dc6"
      },
      {
        "name": "Guinea",
        "code": "GN",
        "_id": "5d53d3cb3587ab007e7b8dc5"
      },
      {
        "name": "Guinea-Bissau",
        "code": "GW",
        "_id": "5d53d3cb3587ab007e7b8dc4"
      },
      {
        "name": "Guyana",
        "code": "GY",
        "_id": "5d53d3cb3587ab007e7b8dc3"
      },
      {
        "name": "Haiti",
        "code": "HT",
        "_id": "5d53d3cb3587ab007e7b8dc2"
      },
      {
        "name": "Heard Island and McDonald Mcdonald Islands",
        "code": "HM",
        "_id": "5d53d3cb3587ab007e7b8dc1"
      },
      {
        "name": "Holy See (Vatican City State)",
        "code": "VA",
        "_id": "5d53d3cb3587ab007e7b8dc0"
      },
      {
        "name": "Honduras",
        "code": "HN",
        "_id": "5d53d3cb3587ab007e7b8dbf"
      },
      {
        "name": "Hong Kong",
        "code": "HK",
        "_id": "5d53d3cb3587ab007e7b8dbe"
      },
      {
        "name": "Hungary",
        "code": "HU",
        "_id": "5d53d3cb3587ab007e7b8dbd"
      },
      {
        "name": "Iceland",
        "code": "IS",
        "_id": "5d53d3cb3587ab007e7b8dbc"
      },
      {
        "name": "India",
        "code": "IN",
        "_id": "5d53d3cb3587ab007e7b8dbb"
      },
      {
        "name": "Indonesia",
        "code": "ID",
        "_id": "5d53d3cb3587ab007e7b8dba"
      },
      {
        "name": "Iran, Islamic Republic of",
        "code": "IR",
        "_id": "5d53d3cb3587ab007e7b8db9"
      },
      {
        "name": "Iraq",
        "code": "IQ",
        "_id": "5d53d3cb3587ab007e7b8db8"
      },
      {
        "name": "Ireland",
        "code": "IE",
        "_id": "5d53d3cb3587ab007e7b8db7"
      },
      {
        "name": "Isle of Man",
        "code": "IM",
        "_id": "5d53d3cb3587ab007e7b8db6"
      },
      {
        "name": "Israel",
        "code": "IL",
        "_id": "5d53d3cb3587ab007e7b8db5"
      },
      {
        "name": "Italy",
        "code": "IT",
        "_id": "5d53d3cb3587ab007e7b8db4"
      },
      {
        "name": "Jamaica",
        "code": "JM",
        "_id": "5d53d3cb3587ab007e7b8db3"
      },
      {
        "name": "Japan",
        "code": "JP",
        "_id": "5d53d3cb3587ab007e7b8db2"
      },
      {
        "name": "Jersey",
        "code": "JE",
        "_id": "5d53d3cb3587ab007e7b8db1"
      },
      {
        "name": "Jordan",
        "code": "JO",
        "_id": "5d53d3cb3587ab007e7b8db0"
      },
      {
        "name": "Kazakhstan",
        "code": "KZ",
        "_id": "5d53d3cb3587ab007e7b8daf"
      },
      {
        "name": "Kenya",
        "code": "KE",
        "_id": "5d53d3cb3587ab007e7b8dae"
      },
      {
        "name": "Kiribati",
        "code": "KI",
        "_id": "5d53d3cb3587ab007e7b8dad"
      },
      {
        "name": "Korea, Democratic People's Republic of",
        "code": "KP",
        "_id": "5d53d3cb3587ab007e7b8dac"
      },
      {
        "name": "Korea, Republic of",
        "code": "KR",
        "_id": "5d53d3cb3587ab007e7b8dab"
      },
      {
        "name": "Kuwait",
        "code": "KW",
        "_id": "5d53d3cb3587ab007e7b8daa"
      },
      {
        "name": "Kyrgyzstan",
        "code": "KG",
        "_id": "5d53d3cb3587ab007e7b8da9"
      },
      {
        "name": "Lao People's Democratic Republic",
        "code": "LA",
        "_id": "5d53d3cb3587ab007e7b8da8"
      },
      {
        "name": "Latvia",
        "code": "LV",
        "_id": "5d53d3cb3587ab007e7b8da7"
      },
      {
        "name": "Lebanon",
        "code": "LB",
        "_id": "5d53d3cb3587ab007e7b8da6"
      },
      {
        "name": "Lesotho",
        "code": "LS",
        "_id": "5d53d3cb3587ab007e7b8da5"
      },
      {
        "name": "Liberia",
        "code": "LR",
        "_id": "5d53d3cb3587ab007e7b8da4"
      },
      {
        "name": "Libya",
        "code": "LY",
        "_id": "5d53d3cb3587ab007e7b8da3"
      },
      {
        "name": "Lithuania",
        "code": "LT",
        "_id": "5d53d3cb3587ab007e7b8da2"
      },
      {
        "name": "Liechtenstein",
        "code": "LI",
        "_id": "5d53d3cb3587ab007e7b8da1"
      },
      {
        "name": "Luxembourg",
        "code": "LU",
        "_id": "5d53d3cb3587ab007e7b8da0"
      },
      {
        "name": "Macao",
        "code": "MO",
        "_id": "5d53d3cb3587ab007e7b8d9f"
      },
      {
        "name": "Macedonia, the Former Yugoslav Republic of",
        "code": "MK",
        "_id": "5d53d3cb3587ab007e7b8d9e"
      },
      {
        "name": "Madagascar",
        "code": "MG",
        "_id": "5d53d3cb3587ab007e7b8d9d"
      },
      {
        "name": "Malawi",
        "code": "MW",
        "_id": "5d53d3cb3587ab007e7b8d9c"
      },
      {
        "name": "Malaysia",
        "code": "MY",
        "_id": "5d53d3cb3587ab007e7b8d9b"
      },
      {
        "name": "Maldives",
        "code": "MV",
        "_id": "5d53d3cb3587ab007e7b8d9a"
      },
      {
        "name": "Mali",
        "code": "ML",
        "_id": "5d53d3cb3587ab007e7b8d99"
      },
      {
        "name": "Malta",
        "code": "MT",
        "_id": "5d53d3cb3587ab007e7b8d98"
      },
      {
        "name": "Marshall Islands",
        "code": "MH",
        "_id": "5d53d3cb3587ab007e7b8d97"
      },
      {
        "name": "Martinique",
        "code": "MQ",
        "_id": "5d53d3cb3587ab007e7b8d96"
      },
      {
        "name": "Mauritania",
        "code": "MR",
        "_id": "5d53d3cb3587ab007e7b8d95"
      },
      {
        "name": "Mauritius",
        "code": "MU",
        "_id": "5d53d3cb3587ab007e7b8d94"
      },
      {
        "name": "Mayotte",
        "code": "YT",
        "_id": "5d53d3cb3587ab007e7b8d93"
      },
      {
        "name": "Mexico",
        "code": "MX",
        "_id": "5d53d3cb3587ab007e7b8d92"
      },
      {
        "name": "Micronesia, Federated States of",
        "code": "FM",
        "_id": "5d53d3cb3587ab007e7b8d91"
      },
      {
        "name": "Moldova, Republic of",
        "code": "MD",
        "_id": "5d53d3cb3587ab007e7b8d90"
      },
      {
        "name": "Monaco",
        "code": "MC",
        "_id": "5d53d3cb3587ab007e7b8d8f"
      },
      {
        "name": "Mongolia",
        "code": "MN",
        "_id": "5d53d3cb3587ab007e7b8d8e"
      },
      {
        "name": "Montenegro",
        "code": "ME",
        "_id": "5d53d3cb3587ab007e7b8d8d"
      },
      {
        "name": "Montserrat",
        "code": "MS",
        "_id": "5d53d3cb3587ab007e7b8d8c"
      },
      {
        "name": "Morocco",
        "code": "MA",
        "_id": "5d53d3cb3587ab007e7b8d8b"
      },
      {
        "name": "Mozambique",
        "code": "MZ",
        "_id": "5d53d3cb3587ab007e7b8d8a"
      },
      {
        "name": "Myanmar",
        "code": "MM",
        "_id": "5d53d3cb3587ab007e7b8d89"
      },
      {
        "name": "Namibia",
        "code": "NA",
        "_id": "5d53d3cb3587ab007e7b8d88"
      },
      {
        "name": "Nauru",
        "code": "NR",
        "_id": "5d53d3cb3587ab007e7b8d87"
      },
      {
        "name": "Nepal",
        "code": "NP",
        "_id": "5d53d3cb3587ab007e7b8d86"
      },
      {
        "name": "Netherlands",
        "code": "NL",
        "_id": "5d53d3cb3587ab007e7b8d85"
      },
      {
        "name": "Netherlands Antilles",
        "code": "AN",
        "_id": "5d53d3cb3587ab007e7b8d84"
      },
      {
        "_id": "5d53d4e6203d38007f7f0566",
        "code": "NC",
        "name": "New Caledonia"
      },
      {
        "_id": "5d53d4e6203d38007f7f0565",
        "code": "NZ",
        "name": "New Zealand"
      },
      {
        "_id": "5d53d4e6203d38007f7f0564",
        "code": "NI",
        "name": "Nicaragua"
      },
      {
        "_id": "5d53d4e6203d38007f7f0563",
        "code": "NE",
        "name": "Niger"
      },
      {
        "_id": "5d53d4e6203d38007f7f0562",
        "code": "NG",
        "name": "Nigeria"
      },
      {
        "_id": "5d53d4e6203d38007f7f0561",
        "code": "NU",
        "name": "Niue"
      },
      {
        "_id": "5d53d4e6203d38007f7f0560",
        "code": "NF",
        "name": "Norfolk Island"
      },
      {
        "_id": "5d53d4e6203d38007f7f055f",
        "code": "MP",
        "name": "Northern Mariana Islands"
      },
      {
        "_id": "5d53d4e6203d38007f7f055e",
        "code": "NO",
        "name": "Norway"
      },
      {
        "_id": "5d53d4e6203d38007f7f055d",
        "code": "OM",
        "name": "Oman"
      },
      {
        "_id": "5d53d4e6203d38007f7f055c",
        "code": "PK",
        "name": "Pakistan"
      },
      {
        "_id": "5d53d4e6203d38007f7f055b",
        "code": "PW",
        "name": "Palau"
      },
      {
        "_id": "5d53d4e6203d38007f7f055a",
        "code": "PS",
        "name": "Palestine, State of"
      },
      {
        "_id": "5d53d4e6203d38007f7f0559",
        "code": "PA",
        "name": "Panama"
      },
      {
        "_id": "5d53d4e6203d38007f7f0558",
        "code": "PG",
        "name": "Papua New Guinea"
      },
      {
        "_id": "5d53d4e6203d38007f7f0557",
        "code": "PY",
        "name": "Paraguay"
      },
      {
        "_id": "5d53d4e6203d38007f7f0556",
        "code": "PE",
        "name": "Peru"
      },
      {
        "_id": "5d53d4e6203d38007f7f0555",
        "code": "PH",
        "name": "Philippines"
      },
      {
        "_id": "5d53d4e6203d38007f7f0554",
        "code": "PN",
        "name": "Pitcairn"
      },
      {
        "_id": "5d53d4e6203d38007f7f0553",
        "code": "PL",
        "name": "Poland"
      },
      {
        "_id": "5d53d4e6203d38007f7f0552",
        "code": "PT",
        "name": "Portugal"
      },
      {
        "_id": "5d53d4e6203d38007f7f0551",
        "code": "PR",
        "name": "Puerto Rico"
      },
      {
        "_id": "5d53d4e6203d38007f7f0550",
        "code": "QA",
        "name": "Qatar"
      },
      {
        "_id": "5d53d4e6203d38007f7f054f",
        "code": "RO",
        "name": "Romania"
      },
      {
        "_id": "5d53d4e6203d38007f7f054e",
        "code": "RU",
        "name": "Russian Federation"
      },
      {
        "_id": "5d53d4e6203d38007f7f054d",
        "code": "RW",
        "name": "Rwanda"
      },
      {
        "_id": "5d53d4e6203d38007f7f054c",
        "code": "BL",
        "name": "Saint Barthélemy"
      },
      {
        "_id": "5d53d4e6203d38007f7f054b",
        "code": "SH",
        "name": "Saint Helena, Ascension and Tristan da Cunha"
      },
      {
        "_id": "5d53d4e6203d38007f7f054a",
        "code": "KN",
        "name": "Saint Kitts and Nevis"
      },
      {
        "_id": "5d53d4e6203d38007f7f0549",
        "code": "LC",
        "name": "Saint Lucia"
      },
      {
        "_id": "5d53d4e6203d38007f7f0548",
        "code": "MF",
        "name": "Saint Martin (French part)"
      },
      {
        "_id": "5d53d4e6203d38007f7f0547",
        "code": "PM",
        "name": "Saint Pierre and Miquelon"
      },
      {
        "_id": "5d53d4e6203d38007f7f0546",
        "code": "VC",
        "name": "Saint Vincent and the Grenadines"
      },
      {
        "_id": "5d53d4e6203d38007f7f0545",
        "code": "WS",
        "name": "Samoa"
      },
      {
        "_id": "5d53d4e6203d38007f7f0544",
        "code": "ST",
        "name": "Sao Tome and Principe"
      },
      {
        "_id": "5d53d4e6203d38007f7f0543",
        "code": "SA",
        "name": "Saudi Arabia"
      },
      {
        "_id": "5d53d4e6203d38007f7f0542",
        "code": "RS",
        "name": "Serbia"
      },
      {
        "_id": "5d53d4e6203d38007f7f0541",
        "code": "SL",
        "name": "Sierra Leone"
      },
      {
        "_id": "5d53d4e6203d38007f7f0540",
        "code": "SG",
        "name": "Singapore"
      },
      {
        "_id": "5d53d4e6203d38007f7f053f",
        "code": "SX",
        "name": "Sint Maarten (Dutch part)"
      },
      {
        "_id": "5d53d4e6203d38007f7f053e",
        "code": "SK",
        "name": "Slovakia"
      },
      {
        "_id": "5d53d4e6203d38007f7f053d",
        "code": "SI",
        "name": "Slovenia"
      },
      {
        "_id": "5d53d4e6203d38007f7f053c",
        "code": "SB",
        "name": "Solomon Islands"
      },
      {
        "_id": "5d53d4e6203d38007f7f053b",
        "code": "SO",
        "name": "Somalia"
      },
      {
        "_id": "5d53d4e6203d38007f7f053a",
        "code": "ZA",
        "name": "South Africa"
      },
      {
        "_id": "5d53d4e6203d38007f7f0539",
        "code": "GS",
        "name": "South Georgia and the South Sandwich Islands"
      },
      {
        "_id": "5d53d4e6203d38007f7f0538",
        "code": "SS",
        "name": "South Sudan"
      },
      {
        "_id": "5d53d4e6203d38007f7f0537",
        "code": "ES",
        "name": "Spain"
      },
      {
        "_id": "5d53d4e6203d38007f7f0536",
        "code": "LK",
        "name": "Sri Lanka"
      },
      {
        "_id": "5d53d4e6203d38007f7f0535",
        "code": "SD",
        "name": "Sudan"
      },
      {
        "_id": "5d53d4e6203d38007f7f0534",
        "code": "SR",
        "name": "Suriname"
      },
      {
        "_id": "5d53d4e6203d38007f7f0533",
        "code": "SJ",
        "name": "Svalbard and Jan Mayen"
      },
      {
        "_id": "5d53d4e6203d38007f7f0532",
        "code": "SZ",
        "name": "Swaziland"
      },
      {
        "_id": "5d53d4e6203d38007f7f0531",
        "code": "SE",
        "name": "Sweden"
      },
      {
        "_id": "5d53d4e6203d38007f7f0530",
        "code": "CH",
        "name": "Switzerland"
      },
      {
        "_id": "5d53d4e6203d38007f7f052f",
        "code": "SY",
        "name": "Syrian Arab Republic"
      },
      {
        "_id": "5d53d4e6203d38007f7f052e",
        "code": "TW",
        "name": "Taiwan, Province of China"
      },
      {
        "_id": "5d53d4e6203d38007f7f052d",
        "code": "TJ",
        "name": "Tajikistan"
      },
      {
        "_id": "5d53d4e6203d38007f7f052c",
        "code": "TZ",
        "name": "Tanzania, United Republic of"
      },
      {
        "_id": "5d53d4e6203d38007f7f052b",
        "code": "TH",
        "name": "Thailand"
      },
      {
        "_id": "5d53d4e6203d38007f7f052a",
        "code": "TL",
        "name": "Timor-Leste"
      },
      {
        "_id": "5d53d4e6203d38007f7f0529",
        "code": "TG",
        "name": "Togo"
      },
      {
        "_id": "5d53d4e6203d38007f7f0528",
        "code": "TK",
        "name": "Tokelau"
      },
      {
        "_id": "5d53d4e6203d38007f7f0527",
        "code": "TO",
        "name": "Tonga"
      },
      {
        "_id": "5d53d4e6203d38007f7f0526",
        "code": "TT",
        "name": "Trinidad and Tobago"
      },
      {
        "_id": "5d53d4e6203d38007f7f0525",
        "code": "TN",
        "name": "Tunisia"
      },
      {
        "_id": "5d53d4e6203d38007f7f0524",
        "code": "TR",
        "name": "Turkey"
      },
      {
        "_id": "5d53d4e6203d38007f7f0523",
        "code": "TM",
        "name": "Turkmenistan"
      },
      {
        "_id": "5d53d4e6203d38007f7f0522",
        "code": "TC",
        "name": "Turks and Caicos Islands"
      },
      {
        "_id": "5d53d4e6203d38007f7f0521",
        "code": "TV",
        "name": "Tuvalu"
      },
      {
        "_id": "5d53d4e6203d38007f7f0520",
        "code": "UG",
        "name": "Uganda"
      },
      {
        "_id": "5d53d4e6203d38007f7f051f",
        "code": "UA",
        "name": "Ukraine"
      },
      {
        "_id": "5d53d4e6203d38007f7f051e",
        "code": "AE",
        "name": "United Arab Emirates"
      },
      {
        "_id": "5d53d4e6203d38007f7f051d",
        "code": "GB",
        "name": "United Kingdom"
      },
      {
        "_id": "5d53d4e6203d38007f7f051c",
        "code": "US",
        "name": "United States"
      },
      {
        "_id": "5d53d4e6203d38007f7f051b",
        "code": "UM",
        "name": "United States Minor Outlying Islands"
      },
      {
        "_id": "5d53d4e6203d38007f7f051a",
        "code": "UY",
        "name": "Uruguay"
      },
      {
        "_id": "5d53d4e6203d38007f7f0519",
        "code": "UZ",
        "name": "Uzbekistan"
      },
      {
        "_id": "5d53d4e6203d38007f7f0518",
        "code": "VU",
        "name": "Vanuatu"
      },
      {
        "_id": "5d53d4e6203d38007f7f0517",
        "code": "VE",
        "name": "Venezuela, Bolivarian Republic of"
      },
      {
        "_id": "5d53d4e6203d38007f7f0516",
        "code": "VN",
        "name": "Viet Nam"
      },
      {
        "_id": "5d53d4e6203d38007f7f0515",
        "code": "VG",
        "name": "Virgin Islands, British"
      },
      {
        "_id": "5d53d4e6203d38007f7f0514",
        "code": "VI",
        "name": "Virgin Islands, U.S."
      },
      {
        "_id": "5d53d4e6203d38007f7f0513",
        "code": "WF",
        "name": "Wallis and Futuna"
      },
      {
        "_id": "5d53d4e6203d38007f7f0512",
        "code": "EH",
        "name": "Western Sahara"
      },
      {
        "_id": "5d53d4e6203d38007f7f0511",
        "code": "YE",
        "name": "Yemen"
      },
      {
        "_id": "5d53d4e6203d38007f7f0510",
        "code": "ZM",
        "name": "Zambia"
      },
      {
        "_id": "5d53d4e6203d38007f7f050f",
        "code": "ZW",
        "name": "Zimbabwe"
      }
    ],
    "release": "2019-10-03T15:22:45.822Z",
    "seo": {
      "title": null,
      "desc": "Find your flow of combat in this Action Adventure game, Absolver will test your skill and timing in beating your opponents and continuing your journey."
    },
    "slug": "absolver",
    "steam": {
      "id": 473690,
      "release": "2017-08-29T00:00:00.000Z",
      "dlc": [
        893770
      ],
      "packages": [],
      "type": "app"
    },
    "type": "game",
    "url": "http://www.absolvergame.com",
    "video": [
      "oX9dPFlEvnc"
    ],
    "visible": {
      "valid_until": null,
      "valid_from": "2019-10-02T23:00:00.000Z"
    },
    "cover": "3cd8d1d3-913c-4841-b0ab-d36cc00d7eac.jpeg",
    "downloads": [],
    "template_type": "standard",
    "showReview": true,
    "desc": "<p>In the ruins of the fallen Adal Empire, you awaken with a mysterious mask on your face, and faint recollections of an esoteric ceremony. Freeing you from hunger, thirst, and even death, the mask is the creation of the Guides, the rulers of these lands, who have placed you here to determine whether you are worthy of becoming part of the elite corps of Absolvers. As you wander these forsaken lands, encountering other Prospects like you, you will learn new combat styles, acquire weapons, gear and armor, and build a team of warriors with whom to fight side by side in Arenas of combat.</p>&#10;<p><br/><strong>Fluid Real-Time Combat: </strong>Position yourself in one of four tactical stances during real-time battles and execute devastating attacks, dodges, and parries. Movement becomes your weapon as you engage in solo duels or intense multiplayer melee battles.<br/><br/><strong>Customizable Style and Flow:</strong> Players will define their character&#8217;s playstyle by picking a combat style, a weapon of choice, and arranging attacks in their Combat Deck to design their unique and personal attack flow. <br/><br/><strong>Online Multiplayer Action and Narrative:</strong> Prospects and Absolvers will seamlessly encounter others in the world, generating unique stories that emerge through player interaction and choices. These moments are filled with tension as intentions to battle or befriend are never clear: trust is always a leap of faith. Encounters will have lasting consequences and transform into meaningful relationships as you make friends or enemies and find mentors or disciples. <br/><br/><strong>PvP and PvE:</strong> Explore a rich and dynamic world including dedicated PvP battle arenas where champions will receive spoils of victory and progress in the ranks of the Absolvers, and PvE areas in which players cooperatively battle to retrieve rare loot and equipment from the ruins of Adal.<br/><br/><strong>ABSOLVER CONTENT UPDATES</strong><br/>The development team at Sloclap is dedicated to improving and expanding Absolver based on community feedback once the game is live. In the coming weeks and months, Prospects can expect regular updates to the game to fix any issues that appear, as well as both minor and major content updates. These updates already include 3v3 Game Mode and a Spectator Mode soon after launch, but many more updates can be expected, from new combat styles and moves to new powers and equipment. Please follow updates here and on <a href=\"https://steamcommunity.com/linkfilter/?url=http://absolver.com\" target=\"_blank\" rel=\"noopener\">absolver.com</a> or @Absolver on Twitter for the latest.</p>",
    "hitcardVideo": "KjnrwGzvB9Tz6l46MyXjclEmgoLB1NSPqR2z-480p.mp4",
    "genba_id": "27b6e3b6-11bd-4abe-a73c-66c302177053",
    "supplier_id": "5d53dca7b3b6bb007e8fa5b7",
    "currentPrice": {
      "JPY": 323600,
      "GBP": 2499,
      "USD": 2999,
      "EUR": 2999,
      "CAD": 3299,
      "AUD": 4295,
      "RUB": 230700
    },
    "current_discount": {
      "percent": 0,
      "display_percentage": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "recommendations": [
      "dark-souls-iii-deluxe-edition",
      "dark-souls-iii",
      "monster-hunter-world",
      "naruto-to-boruto-shinobi-striker",
      "killing-floor-2",
      "tom-clancys-the-division",
      "boreal-blade",
      "warhammer-vermintide-2",
      "elite-dangerous",
      "warhammer-vermintide-2-collectors-edition",
      "conan-exiles",
      "for-honor",
      "pharaonic",
      "xcom-2-collection",
      "exanima"
    ],
    "recommendations_challenger": [
      "dark-souls-iii-deluxe-edition",
      "dark-souls-iii",
      "monster-hunter-world",
      "naruto-to-boruto-shinobi-striker",
      "killing-floor-2",
      "tom-clancys-the-division",
      "boreal-blade",
      "warhammer-vermintide-2",
      "elite-dangerous",
      "warhammer-vermintide-2-collectors-edition",
      "conan-exiles",
      "for-honor",
      "pharaonic",
      "xcom-2-collection",
      "exanima"
    ],
    "reviews": [
      {
        "scoreType": "stars",
        "outletName": "GamesRadar+",
        "message": "\"Absolver feels like a (difficult, sometimes frustrating) step into a larger world, and if you can hang with it, it'll leave you hungry for more.\"",
        "url": "http://www.gamesradar.com/absolver-review-theres-always-the-promise-of-more-if-you-can-surmount-the-challenges-it-throws-at-you/",
        "displayScore": "4.5 / 5 stars",
        "outletImage": "https://cdn.fanatical.com/production/logos/gameradar.jpg",
        "author": "Sam Prell",
        "starScore": 4.5,
        "outOfStarScore": 5
      },
      {
        "scoreType": "text",
        "outletName": "Eurogamer",
        "message": "\"A one-of-a-kind blend of blood-thumping martial arts, combo curation and grindy multiplayer set in a ravishing wasteland.\"",
        "url": "http://www.eurogamer.net/articles/2017-08-29-absolver-review",
        "displayScore": "Recommended",
        "outletImage": "https://cdn.fanatical.com/production/logos/eurogamer.jpg",
        "author": "Edwin Evans-Thirlwell"
      },
      {
        "scoreType": "text",
        "outletName": "PC Gamer",
        "message": "\"A great customizable fighting system and a cooperative spirit fill the empty spaces in a bleak open world.\"",
        "url": "http://www.pcgamer.com/absolver-review/",
        "displayScore": "78 / 100",
        "outletImage": "https://cdn.fanatical.com/production/logos/pcgamer.jpg",
        "author": "Tyler Wilde"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/4462/absolver",
    "opencriticScoreString": "73% Fair",
    "opencriticReviewCount": 84,
    "opencriticPercentRecommended": 45,
    "openCriticScore": 73,
    "videos": [
      {
        "id": "6fBu3LTfZrM",
        "title": "Faze_Devil204  GAME Play OF ABSOLVER",
        "date": "2018-07-17T21:45:17Z",
        "thumbnail_url": "https://i.ytimg.com/vi/6fBu3LTfZrM/hqdefault.jpg"
      },
      {
        "id": "QfFrwhJUqho",
        "title": "[Absolver] Game-Play 012 ... The &quot;Red-Boat Wing-Chun&quot; Deck",
        "date": "2017-09-12T00:52:47Z",
        "thumbnail_url": "https://i.ytimg.com/vi/QfFrwhJUqho/hqdefault.jpg"
      },
      {
        "id": "11Sy0yGb-zc",
        "title": "ABSOLVER- Encounter",
        "date": "2021-05-20T07:43:27Z",
        "thumbnail_url": "https://i.ytimg.com/vi/11Sy0yGb-zc/hqdefault.jpg"
      },
      {
        "id": "vvyywi6cBeM",
        "title": "[Absolver] Game-Play 001",
        "date": "2017-08-30T18:14:22Z",
        "thumbnail_url": "https://i.ytimg.com/vi/vvyywi6cBeM/hqdefault.jpg"
      },
      {
        "id": "AdCnN0TIpmg",
        "title": "ABSOLVER",
        "date": "2021-06-29T10:19:25Z",
        "thumbnail_url": "https://i.ytimg.com/vi/AdCnN0TIpmg/hqdefault.jpg"
      },
      {
        "id": "nx0d2JsAL8s",
        "title": "Another lag switcher? | Absolver",
        "date": "2021-09-07T22:54:53Z",
        "thumbnail_url": "https://i.ytimg.com/vi/nx0d2JsAL8s/hqdefault.jpg"
      },
      {
        "id": "3wMuHTlWwr4",
        "title": "[Absolver] Game-Play 002",
        "date": "2017-08-30T18:34:35Z",
        "thumbnail_url": "https://i.ytimg.com/vi/3wMuHTlWwr4/hqdefault.jpg"
      },
      {
        "id": "LQPRmIXQeIs",
        "title": "[Absolver] Game-Play 003",
        "date": "2017-08-30T19:47:58Z",
        "thumbnail_url": "https://i.ytimg.com/vi/LQPRmIXQeIs/hqdefault.jpg"
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {},
    "streams": [
      {
        "id": "43312730220",
        "user_name": "kumo_uchiha",
        "type": "live",
        "title": "(PS4) He Returns.... ",
        "started_at": "2021-09-20T07:19:54Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_kumo_uchiha-{width}x{height}.jpg"
      }
    ]
  },
  {
    "_id": "5ce68b352c9b138168ef66a4",
    "__v": 56,
    "bundles": [],
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 317600,
      "RUB": 224800,
      "AUD": 3969,
      "CAD": 3413,
      "EUR": 2944,
      "USD": 2944,
      "GBP": 2181
    },
    "img": [
      {
        "slug": "cd587b3c-a7ab-4a0f-b667-4262dab5af71.png",
        "alt": "cd587b3c-a7ab-4a0f-b667-4262dab5af71.png",
        "order": "99"
      },
      {
        "slug": "cf1d581e-5f18-443c-9e3e-195f2561b23c.png",
        "alt": "cf1d581e-5f18-443c-9e3e-195f2561b23c.png",
        "order": "99"
      },
      {
        "slug": "c69497e9-343d-4494-9681-606f6555c101.png",
        "alt": "c69497e9-343d-4494-9681-606f6555c101.png",
        "order": "99"
      },
      {
        "slug": "1abb7051-9afe-436a-9764-808571d04a8e.png",
        "alt": "1abb7051-9afe-436a-9764-808571d04a8e.png",
        "order": "99"
      },
      {
        "slug": "dc937e3e-58fa-4ec9-9fdb-5b589b9d73d7.png",
        "alt": "dc937e3e-58fa-4ec9-9fdb-5b589b9d73d7.png",
        "order": "99"
      },
      {
        "slug": "c14b5d7f-31a9-4ff0-bd1a-cca2dae398b4.png",
        "alt": "c14b5d7f-31a9-4ff0-bd1a-cca2dae398b4.png",
        "order": "99"
      },
      {
        "slug": "2a67bb9e-e047-4a99-a07d-c0c3a27ae3a0.png",
        "alt": "2a67bb9e-e047-4a99-a07d-c0c3a27ae3a0.png",
        "order": "99"
      },
      {
        "slug": "76c71a39-7893-4bb9-bb22-9afb607b8e2b.png",
        "alt": "76c71a39-7893-4bb9-bb22-9afb607b8e2b.png",
        "order": "99"
      },
      {
        "slug": "abe0753d-891c-499b-a97b-e59e087ba86e.png",
        "alt": "abe0753d-891c-499b-a97b-e59e087ba86e.png",
        "order": "99"
      },
      {
        "slug": "474c922a-d406-4670-b5db-868d49507666.png",
        "alt": "474c922a-d406-4670-b5db-868d49507666.png"
      }
    ],
    "visible": {
      "valid_until": null,
      "valid_from": "2020-03-18T15:59:00.000Z"
    },
    "seo": {
      "desc": "Experience one of the most explosive action-adventures to date with Just Cause 3 XXL Edition. This Steam key includes the base game and all DLC!",
      "title": null
    },
    "quotes": [
      {
        "author": "Gamer.nl",
        "message": "\"Just Cause 3 is simply a game you must play, it would surprise us if you wouldn't like it\" - 90/100",
        "_id": "5d53d2b670cb34008594db7c"
      },
      {
        "author": "USGamer",
        "message": "\"Just Cause 3 is a lot like Just Cause 2, but a host of additions including the wingsuit and gear mods make the game a joy to play.\" - 90/100",
        "_id": "5d53d2b670cb34008594db7b"
      },
      {
        "author": "PC Games",
        "message": "\"It gives players a whole lot of explosive tools and then just leans back, waiting to see what you are going to blow up next\" - 88/100",
        "_id": "5d53d2b670cb34008594db7a"
      }
    ],
    "type": "game",
    "display_type": "game",
    "developers": [
      "Avalanche Studios"
    ],
    "publishers": [
      "Square Enix"
    ],
    "collections": [
      "Story Rich Games"
    ],
    "franchises": [
      "Just Cause"
    ],
    "modes": [
      "Singleplayer"
    ],
    "features": [
      "Steam Achievements",
      "Full controller support",
      "Steam Trading Cards"
    ],
    "genres": [
      "Action",
      "Adventure"
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish - Spain",
      "Arabic",
      "Polish",
      "Portuguese - Brazil",
      "Russian",
      "Japanese"
    ],
    "regions_included": [],
    "regions_excluded": [],
    "video": [
      "-Ci5Qm4ekNA"
    ],
    "name": "Just Cause 3 XXL Edition",
    "url": "https://justcause.com/",
    "release": "2019-05-23T11:59:49.009Z",
    "platform_specs": {
      "win": {
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Vista SP2 / Windows 7.1 SP1 / Windows 8.1 (64-bit Operating System Required)<br></li><li><strong>Processor:</strong> Intel Core i7-3770, 3.4 GHz / AMD FX-8350, 4.0 GHz<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> NVIDIA GeForce GTX 780 (3GB) / AMD R9 290 (4GB)<br></li><li><strong>Storage:</strong> 54 GB available space</li></ul>",
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Vista SP2 / Windows 7.1 SP1 / Windows 8.1 (64-bit Operating System Required)<br></li><li><strong>Processor:</strong> Intel Core i5-2500k, 3.3GHz / AMD Phenom II X6 1075T 3GHz<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> NVIDIA GeForce GTX 670 (2GB) / AMD Radeon HD 7870 (2GB)<br></li><li><strong>Storage:</strong> 54 GB available space</li></ul>"
      }
    },
    "slug": "just-cause-3-xxl-edition",
    "steam": {
      "packages": [],
      "dlc": [
        619910,
        401850,
        442051,
        442052,
        400551,
        400490,
        388290,
        388291,
        388292,
        388293,
        388294,
        442050
      ],
      "release": "2015-11-30T00:00:00.000Z",
      "id": 225540,
      "type": "app"
    },
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "notice": {
      "legal": "Just Cause 3 © 2014 Square Enix Ltd. All rights reserved. Developed by Avalanche Studios. Published by Square Enix Ltd. Just Cause 3 and the Just Cause logo are trademarks of Square Enix Ltd. Square Enix and the Square Enix logo are trademarks or registered trademarks of Square Enix Holdings Co. Ltd. All other trademarks and trade names are the properties of their respective owners."
    },
    "age": {
      "ACB": 15,
      "USK": 18,
      "PEGI": 18,
      "ESRB": 17
    },
    "availability": {
      "valid_until": null,
      "valid_from": "2020-03-18T15:59:00.000Z"
    },
    "artists": [],
    "authors": [],
    "cover": "cb93ce1d-7ceb-4405-8978-b98482e62751.jpeg",
    "downloads": [],
    "template_type": "standard",
    "fandesc": "It's a game that lets you strap multiple mini rockets to a cow and watch as it shoots off and spirals through the air... top that! This explosive action-adventure allows players to create pure carnage as you blow up huge facilities as you loosen General Sebastiano Di Ravello's grasp over Medici. With strong physics-based gameplay and some neat features such as base jumping, Just Cause 3 offers a great overall experience for action fans.",
    "showReview": true,
    "hide_from_search": false,
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "free_redeem_code": null,
    "desc": "<p>Experience one of the most explosive action-adventures to date with Just Cause 3. With this XXL Edition Steam PC key, you'll follow returning protagonist&#160;Rico Rodriguez as he attempts to free the island of Medici from military dictatorship - by basically blowing up everything!</p>&#10;<p>Just Cause 3 XXL Edition packs the critically acclaimed Just Cause 3 game as well as a great selection of extra missions, explosive weapons and vehicles to expand your experience in Medici. This ultimate edition of the game will please newcomers who want to jump into all of Rico's missions with a boosted arsenal and exotic new vehicles.&#160;<br/><br/>This pack includes:</p>&#10;<ul class=\"bb_ul\">&#10;<li>Just Cause 3 base game</li>&#10;<li>Air, Land and Sea Expansion Pass</li>&#10;<li>Weaponized Vehicle Pack</li>&#10;<li>Explosive Weapon Pack</li>&#10;<li>Reaper Missile Mech</li>&#10;<li>Kousav&#225; Rifle</li>&#10;</ul>&#10;<p>The Mediterranean republic of Medici is suffering under the brutal control of General Di Ravello, a dictator with an insatiable appetite for power. Enter Rico Rodriguez, a man on a mission to destroy the General&#8217;s hold on power by any means necessary. With over 400 square miles of complete freedom from sky to seabed and a huge arsenal of weaponry, gadgets and vehicles, prepare to unleash chaos in the most creative and explosive ways you can imagine.</p>&#10;<p><strong>YOUR OFFICIAL JUST CAUSE 3 XXL EDITION STEAM PC KEY GIVES YOU:</strong></p>&#10;<ul class=\"bb_ul\">&#10;<li>Explore a Mediterranean island paradise with complete vertical freedom &#8211; skydive, BASE jump and free dive in an open world with virtually zero limits.</li>&#10;<li>Glide through the air and swoop across mountains with your Wingsuit giving a new way to rain death from above.</li>&#10;<li>Use your Grapple and Parachute to scale buildings, hijack vehicles, move quickly or tether objects together for creative new ways to cause Chaos.</li>&#10;<li>Cause massive chains of destruction in military bases, harbors, prisons, police stations and communications facilities to bring down a dictator.</li>&#10;<li>Arm yourself with a wide range of explosive weaponry from shotguns and missile launchers to tank-busters and air-strikes.</li>&#10;<li>Choose from a huge variety of different vehicles to drive including speedboats, jets, helicopters, turbo-fuelled sports cars and superbikes.</li>&#10;<li>Get adventurous with dozens of challenge missions and collectibles to discover.</li>&#10;<li>Online community features.</li>&#10;</ul>",
    "hitcardVideo": "mp2wVK4KoViB0BjR5PVys9QgQ49Vy-480p.mp4",
    "supplier_id": "5ce3e1fb848d140147800d87",
    "currentPrice": {
      "JPY": 317600,
      "RUB": 224800,
      "AUD": 3969,
      "CAD": 3413,
      "EUR": 2944,
      "USD": 2944,
      "GBP": 2181
    },
    "current_discount": {
      "percent": 0,
      "display_percentage": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [],
    "in_bundles": [
      {
        "_id": "5fd9dba53bb8d1007e354be7",
        "cover": "c89194fb-0b49-4393-858b-6777f8a3a0f2.jpeg",
        "fullPrice": {
          "JPY": 843500,
          "RUB": 605600,
          "AUD": 11159,
          "CAD": 9411,
          "EUR": 7942,
          "USD": 7942,
          "GBP": 5779
        },
        "name": "Square Enix Action Pack",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 843500,
          "RUB": 605600,
          "AUD": 11159,
          "CAD": 9411,
          "EUR": 7942,
          "USD": 7942,
          "GBP": 5779
        },
        "slug": "square-enix-action-pack",
        "type": "bundle",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "is_srp_bundle": true,
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 843500,
          "RUB": 605600,
          "AUD": 11159,
          "CAD": 9411,
          "EUR": 7942,
          "USD": 7942,
          "GBP": 5779
        },
        "current_discount": {
          "percent": 0,
          "display_percentage": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0
      }
    ],
    "packs": [],
    "base_game": null,
    "related": [],
    "recommendations": [
      "the-crew-ultimate-edition",
      "endless-legend",
      "hitman-game-of-the-year-edition",
      "space-engineers",
      "tom-clancys-ghost-recon-wildlands",
      "sniper-elite-3",
      "far-cry-3-deluxe-edition",
      "human-fall-flat",
      "the-crew-2-season-pass",
      "warpips",
      "spintires",
      "tropico-5",
      "deadrising-4",
      "no-man-s-sky",
      "tropico-3-absolute-power"
    ],
    "recommendations_challenger": [
      "the-crew-ultimate-edition",
      "endless-legend",
      "hitman-game-of-the-year-edition",
      "space-engineers",
      "tom-clancys-ghost-recon-wildlands",
      "sniper-elite-3",
      "far-cry-3-deluxe-edition",
      "human-fall-flat",
      "the-crew-2-season-pass",
      "warpips",
      "spintires",
      "tropico-5",
      "deadrising-4",
      "no-man-s-sky",
      "tropico-3-absolute-power"
    ],
    "reviews": [
      {
        "scoreType": "stars",
        "outletName": "Giant Bomb",
        "message": "\"Rico's third adventure stays the course, but at least this course involves slingshotting cows off of cliffs.\"",
        "url": "http://www.giantbomb.com/reviews/just-cause-3-review/1900-729/",
        "displayScore": "4 / 5 stars",
        "outletImage": "https://cdn.fanatical.com/production/logos/giantbomb.jpg",
        "author": "Dan Ryckert",
        "starScore": 4,
        "outOfStarScore": 5
      },
      {
        "scoreType": "text",
        "outletName": "Game Informer",
        "message": "\"Blowing up everything loses its anarchic thrill after several dozen times, but it's still a blast\"",
        "url": "https://www.gameinformer.com/games/just_cause_3/b/xboxone/archive/2015/11/30/just-cause-3-review-game-informer.aspx",
        "displayScore": "8 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/gameinformer.jpg",
        "author": "Jeff Cork"
      },
      {
        "scoreType": "text",
        "outletName": "Forbes",
        "message": "\"There are so few ways that this game could be a better version of itself, or better at what it does. Just Cause 3 is, from any way I care to think about it, a massive success.\"",
        "url": "http://www.forbes.com/sites/games/2015/12/01/just-cause-3-review-blow-it-up/",
        "displayScore": "9.5 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/forbes.jpg",
        "author": "Dave Thier"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/1528/just-cause-3",
    "opencriticScoreString": "75% Strong",
    "opencriticReviewCount": 109,
    "opencriticPercentRecommended": 51,
    "openCriticScore": 75,
    "videos": [
      {
        "id": "ayj8gHLAyls",
        "title": "i finally finished just cause 3",
        "date": "2020-07-14T14:10:04Z",
        "thumbnail_url": "https://i.ytimg.com/vi/ayj8gHLAyls/hqdefault.jpg"
      },
      {
        "id": "IQwDQar0bM4",
        "title": "Nvidia GeForce 840M Gaming: Just Cause 3",
        "date": "2016-01-08T18:37:14Z",
        "thumbnail_url": "https://i.ytimg.com/vi/IQwDQar0bM4/hqdefault.jpg"
      },
      {
        "id": "EUQNrznhQpI",
        "title": "DLC da NAVE GIGANTE | Just Cause 3 XXL #1",
        "date": "2021-07-12T22:15:25Z",
        "thumbnail_url": "https://i.ytimg.com/vi/EUQNrznhQpI/hqdefault.jpg"
      },
      {
        "id": "C7pL6jteAtw",
        "title": "Just Cause  3 (random base takeover clip to help you decide with the recent discounted xxl package)",
        "date": "2020-05-21T18:05:23Z",
        "thumbnail_url": "https://i.ytimg.com/vi/C7pL6jteAtw/hqdefault.jpg"
      },
      {
        "id": "TfDxGlEgqnA",
        "title": "Playing boom island",
        "date": "2018-12-26T18:43:19Z",
        "thumbnail_url": "https://i.ytimg.com/vi/TfDxGlEgqnA/hqdefault.jpg"
      },
      {
        "id": "UITPJWdOtXw",
        "title": "ПОЛНЫЙ ПИ*ДЕЦ!!! УГАР, ЭПИК, БАГИ В JUST CAUSE 3 МУЛЬТИПЛЕЕР!!!",
        "date": "2017-02-25T11:00:02Z",
        "thumbnail_url": "https://i.ytimg.com/vi/UITPJWdOtXw/hqdefault.jpg"
      },
      {
        "id": "0iaYSchxIOs",
        "title": "Just Cause 3 [HD+] #016 ✔ Spaß mit Windräder ✔ Let&#39;s Play Just Cause 3",
        "date": "2015-12-10T12:30:00Z",
        "thumbnail_url": "https://i.ytimg.com/vi/0iaYSchxIOs/hqdefault.jpg"
      },
      {
        "id": "xm31j5x-PKg",
        "title": "PUBG : Vikendi Map | GTX 1050 Ti + i5-7400 | 1080p",
        "date": "2018-12-07T19:36:45Z",
        "thumbnail_url": "https://i.ytimg.com/vi/xm31j5x-PKg/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "XnjCkxMAACAACIVi",
        "uid": "spring-sale-encore-last-chance-to-grab-steam-pc-deals",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22XnjCkxMAACAACIVi%22%29+%5D%5D",
        "tags": [
          "Barotrauma",
          "EVERSPACE Ultimate Edition",
          "Just Cause 3 XXL Edition",
          "F1 2019",
          "Bloodstained: Ritual of the Night",
          "SUPERHOT VR",
          "Sleeping Dogs: Definitive Edition",
          "SOULCALIBUR VI Deluxe Edition",
          "Assetto Corsa Competizione"
        ],
        "first_publication_date": "2020-03-23T16:00:04+0000",
        "last_publication_date": "2021-06-07T14:10:24+0000",
        "slugs": [
          "spring-sale-encore---last-chance-to-grab-steam-pc-deals"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2020-03-23T16:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Spring Sale Encore - Last chance to grab Steam PC deals",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/91cfdca1-6d40-4e69-bce8-314f8e4c89e7_Springsale2020-encore-social-twitter.jpg?auto=compress,format&rect=0,0,1200,675&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/91cfdca1-6d40-4e69-bce8-314f8e4c89e7_Springsale2020-encore-social-twitter.jpg?auto=compress,format&rect=0,0,1200,675&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/91cfdca1-6d40-4e69-bce8-314f8e4c89e7_Springsale2020-encore-social-twitter.jpg?auto=compress,format&rect=0,0,1200,675&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/91cfdca1-6d40-4e69-bce8-314f8e4c89e7_Springsale2020-encore-social-twitter.jpg?auto=compress,format&rect=0,0,1200,675&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Don't miss out on these 48-hour deals from our big sale",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": [
        {
          "_id": "612de7f58c172940e1cf9981",
          "slug": "just-cause-3-xxl-edition",
          "rating": 5,
          "display_name": "Sam Jones",
          "title": "Just Cause 3 XXL Edition Review",
          "text": "It's a game that lets you strap multiple mini rockets to a cow and watch as it shoots off and spirals through the air... top that! This explosive action-adventure allows players to create pure carnage as you blow up huge facilities as you loosen General Sebastiano Di Ravello's grasp over Medici. With strong physics-based gameplay and some neat features such as base jumping, Just Cause 3 offers a great overall experience for action fans.",
          "date": "2021-08-31T08:27:33.253Z",
          "staff_review": true,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "5ce68b352c9b138168ef66a4",
          "version_id": "612de7f58c172940e1cf9980",
          "published": true,
          "has_active_version": true
        }
      ]
    },
    "userReviewSummary": {
      "rating_score": 4.5,
      "total_ratings": 4,
      "percent_recommended": 83,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 25,
        "four_star_percentage": 0,
        "five_star_percentage": 75
      },
      "reviewLocales": [
        "en"
      ],
      "total_written_reviews": 1
    }
  },
  {
    "_id": "5af1a9c91d30f7bbe26c063c",
    "__v": 185,
    "type": "game",
    "display_type": "game",
    "name": "Pillars of Eternity II: Deadfire - Obsidian Edition",
    "slug": "pillars-of-eternity-ii-deadfire-obsidian-edition",
    "url": "https://eternity.obsidian.net/",
    "cover": "238f1966-1255-4d38-8f4b-c2ca18471fa6.jpeg",
    "sdesc": null,
    "fandesc": "With a deeper narrative and exploration on both land and sea, players can immerse themselves in the world of Eora like never before. Thanks to its multiple companions and customizable ship options, you'll have a blast when you set sail in Pillars of Eternity II: Deadfire.",
    "desc": "<p>Set sail on a dangerous voyage to exotic lands in isometric RPG action with your Pillars of Eternity II: Deadfire Obsidian Edition Steam PC key. In the sequel to the multi-award-winning RPG, Pillars of Eternity, you'll embark on a quest to find a rogue god over land and sea - with access to additional content including three DLC packs.&#160;</p>&#10;<p>As the Watcher and captain of your own upgradable ship, you'll set a course and discover the vast Deadfire Archipelago with a brand-new new character customization system, meaningful companion relationships, freedom of exploration, and a world that reacts to the complex, moral choices you'll have to make. <br/><br/><strong>THE RIGHT COMPANIONS</strong> <br/>As well as four sidekicks, you can select from seven unique new and returning companions to accompany you on your journey. Watch how they react to each other through the all-new companion relationship system &#8211; or create your own custom party members from scratch. <br/>Create a truly custom alter ego with the reimagined multiclass system, now featuring three sub-classes with their own unique skills. <br/><br/><strong>BRAVE THE STORMY SEAS</strong> <br/>Travel through a living breathing world, creatively built on hand-painted backgrounds integrated seamlessly with 3D models, dynamic weather and lighting, and stunning visual effects. <br/><br/><strong>LEADERSHIP SKILLS</strong> <br/>Captain your crew and upgrade your ship wisely to repel boarders, survive canon fire, and keep a potentially mutinous crew in-line. Customize your boat stronghold to serve as a mobile base for exploring islands and for ship-to-ship encounters. <br/>Claim new ships by stealing them from enemies or go down the more conventional route and purchase one. <br/><br/><strong>YOUR OFFICIAL PILLARS OF ETERNITY II: DEADFIRE OBSIDIAN EDITION STEAM PC KEY GIVES YOU:</strong> <br/><br/></p>&#10;<ul>&#10;<li>Deep narrative and storytelling.</li>&#10;<li>Exploration across a beautiful world.</li>&#10;<li>Immersive dynamic weather conditions.</li>&#10;<li>Pillars of Eternity character import availability.</li>&#10;<li>Engaging isometric combat on land and by sea.</li>&#10;<li><strong>DLC Content Packs #1-3:</strong> Robust content expansions to the base game that will add new areas, new experiences, new items, and expand the world of Pillars of Eternity II: Deadfire.</li>&#10;<li><strong>Official Soundtrack:</strong> The soundtrack to Pillars of Eternity II: Deadfire by Justin Bell, featuring all-new tracks inspired by the peoples and factions of the Deadfire Archipelago.</li>&#10;<li><strong>Defiant Apparel:</strong> This stylish tricorn hat comes with a built-in eyepatch that protects the wearer from a variety of ocular incursions, as well as looking extremely piratical.</li>&#10;<li><strong>Cosmo, the Space Pig:</strong> It wouldn't be Pillars of Eternity without Cosmo! Cosmo accompanies your party, floating on cyan gossamer, inspiring you through a combination of unflappable courage and incredible cuteness.</li>&#10;<li><strong>Digital P&amp;P Guide:</strong> Pillars of Eternity has a strong tradition of adapting and adopting pen-and-paper techniques in our systems and adventure designs. Our designers decided to take that knowledge and give something back to the tabletop community! This pen-and-paper adventuring system has been developed from the ground up by Pillars of Eternity II: Deadfire lead designer Josh Sawyer and other members of the Deadfire design team. Connect with other Deadfire fans and create your own adventures!</li>&#10;<li><strong>Hi-Res Digital Map:</strong> This handsome sea chart is suitable for use as a desktop wallpaper or can be printed to assist you with navigating the treacherous waters of the Deadfire Archipelago.</li>&#10;<li><strong>Digital Guidebook, Vol. II:</strong> Created by our friends at Dark Horse Comics, this is the next volume in the comprehensive guide to the world of Pillars of Eternity, filled with the legends, lore, and lost locations of the Deadfire Archipelago. Useful as an adventuring companion, or just to browse and learn more about the intricacies of this deep and enigmatic corner of Eora, the digital guidebook features beautiful illustrations and plenty of fascinating background.</li>&#10;</ul>",
    "archive": false,
    "giveaway": false,
    "presale": false,
    "hideDiscount": false,
    "bundles": [],
    "img": [
      {
        "alt": "d7eba504-6882-4d2e-b567-6532146f8dbb.jpeg",
        "slug": "d7eba504-6882-4d2e-b567-6532146f8dbb.jpeg",
        "order": "99"
      },
      {
        "alt": "53806595-3fff-4181-82bf-23722d8c39d2.jpeg",
        "slug": "53806595-3fff-4181-82bf-23722d8c39d2.jpeg",
        "order": "99"
      },
      {
        "alt": "920d5bab-e13c-4eee-968b-e09743ef10db.jpeg",
        "slug": "920d5bab-e13c-4eee-968b-e09743ef10db.jpeg",
        "order": "99"
      },
      {
        "alt": "8a0510cd-e3c5-48e0-8330-8fe4447dcee5.jpeg",
        "slug": "8a0510cd-e3c5-48e0-8330-8fe4447dcee5.jpeg",
        "order": "99"
      },
      {
        "alt": "79a66e17-7606-4758-9485-59ead2d75c2b.jpeg",
        "slug": "79a66e17-7606-4758-9485-59ead2d75c2b.jpeg",
        "order": "99"
      },
      {
        "alt": "8730fe86-0661-4d0e-9778-c1d6702475cf.jpeg",
        "slug": "8730fe86-0661-4d0e-9778-c1d6702475cf.jpeg",
        "order": "99"
      },
      {
        "alt": "9cf2c211-4d2d-47bb-916c-5871795182f9.jpeg",
        "slug": "9cf2c211-4d2d-47bb-916c-5871795182f9.jpeg",
        "order": "99"
      },
      {
        "alt": "4248536a-4f6a-4942-b4ca-5bd3788de92a.jpeg",
        "slug": "4248536a-4f6a-4942-b4ca-5bd3788de92a.jpeg"
      }
    ],
    "platform_specs": {
      "win": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows Vista 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Core i3-2100T @ 2.50 GHz / AMD Phenom II X3 B73<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> ATI Radeon HD 4850 or NVIDIA GeForce 9600 GT<br></li><li><strong>Storage:</strong> 14 GB available space<br></li><li><strong>Sound Card:</strong> DirectX Compatible Sound Card<br></li><li><strong>Additional Notes:</strong> These are preliminary system specs and are subject to change.</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows Vista 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Core i5-2400 @ 3.10 GHz / AMD Phenom II X6 1100T<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> Radeon HD 7700 or NVIDIA GeForce GTX 570<br></li><li><strong>Storage:</strong> 14 GB available space<br></li><li><strong>Sound Card:</strong> DirectX Compatible Sound Card<br></li><li><strong>Additional Notes:</strong> These are preliminary system specs and are subject to change.</li></ul>"
      },
      "mac": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> OS X 10.6.3 Leopard 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Core i5-540M @ 2.53 GHz<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> ATI Radeon HD 6750M or NVIDIA GeForce GT 330M<br></li><li><strong>Storage:</strong> 14 GB available space<br></li><li><strong>Additional Notes:</strong> These are preliminary system specs and are subject to change.</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> OS X 10.9 Mavericks 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Core i5-540M @ 3.40 GHz<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> Radeon R9 M290X or Nvidia GeForce GTX 775M 2GB<br></li><li><strong>Storage:</strong> 14 GB available space<br></li><li><strong>Additional Notes:</strong> These are preliminary system specs and are subject to change.</li></ul>"
      },
      "lin": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Ubuntu 14.04 LTS 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Core i3-2100T @ 2.50 GHz / AMD Phenom II X3 B73<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> ATI Radeon HD 4850 or NVIDIA GeForce 9600 GT<br></li><li><strong>Storage:</strong> 14 GB available space<br></li><li><strong>Additional Notes:</strong> These are preliminary system specs and are subject to change.</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Ubuntu 14.04 LTS 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Core i5-2400 @ 3.10 GHz / AMD Phenom II X6 1100T<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> Radeon HD 7700 or NVIDIA GeForce GTX 570<br></li><li><strong>Storage:</strong> 14 GB available space<br></li><li><strong>Additional Notes:</strong> These are preliminary system specs and are subject to change.</li></ul>"
      }
    },
    "visible": {
      "valid_from": "2018-05-08T17:00:00.000Z",
      "valid_until": null
    },
    "availability": {
      "valid_from": "2018-05-08T17:00:00.000Z",
      "valid_until": null
    },
    "video": [
      "ln_plWALAoI"
    ],
    "modes": [
      "Singleplayer"
    ],
    "features": [],
    "developers": [
      "Obsidian Entertainment"
    ],
    "publishers": [
      "Versus Evil"
    ],
    "collections": [
      "Top Picks",
      "Spring Sale Encore 2021"
    ],
    "franchises": [
      "Pillars of Eternity"
    ],
    "genres": [
      "RPG"
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish",
      "Polish",
      "Portuguese",
      "Russian",
      "Simplified Chinese"
    ],
    "release": "2018-01-26T13:31:26.102Z",
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2018-05-07T23:00:00.000Z",
      "id": 258527,
      "type": "bundle"
    },
    "price": {
      "JPY": 594000,
      "RUB": 447500,
      "AUD": 6950,
      "CAD": 6599,
      "EUR": 5999,
      "USD": 5999,
      "GBP": 4499
    },
    "platforms": {
      "linux": true,
      "mac": true,
      "windows": true
    },
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "age": {
      "ESRB": 0,
      "PEGI": 0,
      "USK": 0,
      "ACB": 0
    },
    "notice": {
      "legal": "© 2017 Obsidian Entertainment, Inc. All Rights Reserved. Obsidian, the Obsidian Entertainment logo, Pillars of Eternity, and the Pillars of Eternity logo are trademarks or registered trademarks of Obsidian Entertainment, Inc. All Rights Reserved.\r\n\r\nCopyright © 2017 Versus Evil LLC. All rights reserved. Versus Evil® is a registered trademark of Versus Evil LLC."
    },
    "seo": {
      "desc": "Set sail on a dangerous voyage to exotic lands in isometric RPG action with your Pillars of Eternity II: Deadfire Obsidian Edition Steam PC key. Includes DLC and extra content!",
      "title": null
    },
    "quotes": [
      {
        "_id": "5af5a44949db3a012a231960",
        "message": "\"Are you a fan of RPGs? If so, you must buy this game\" - 5/5",
        "author": "Windows Central"
      },
      {
        "_id": "5af5a44949db3a012a23195f",
        "message": "\"Pillars of Eternity 2: Deadfire is as close to the perfect RPG as one can get\" - 100/100",
        "author": "GameWatcher"
      },
      {
        "_id": "5af5a44949db3a012a23195e",
        "message": "\"A massive, bountiful RPG with richly descriptive writing,\"",
        "author": "PC Gamer"
      }
    ],
    "regions_included": [],
    "regions_excluded": [],
    "bundleCover": "ffc851a9-7813-4176-9d07-d423d6606021.jpeg",
    "fullPrice": {
      "AUD": 10199,
      "GBP": 5799,
      "EUR": 6999,
      "USD": 7499,
      "CAD": 8599
    },
    "ubisoft_ska": false,
    "no_release_date": false,
    "no_release_date_text": null,
    "template_type": "standard",
    "artists": [],
    "authors": [],
    "downloads": [],
    "showReview": true,
    "audit": [],
    "free_redeem_code": null,
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "hitcardVideo": "DLoNEBr2E9tY31L16nnQimWJMXx4WOuyOZ70-480p.mp4",
    "parent_slug": "pillars-of-eternity-ii-deadfire",
    "supplier_id": "564ef75034f0fa1300b1c8d7",
    "currentPrice": {
      "JPY": 463320,
      "RUB": 349050,
      "AUD": 5421,
      "CAD": 5147,
      "EUR": 4679,
      "USD": 4679,
      "GBP": 3509
    },
    "current_discount": {
      "percent": 0.22,
      "display_percentage": true,
      "until": "2021-09-21T15:59:00.000Z",
      "from": "2021-09-19T07:01:00.464Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": true,
      "highlighted": false
    },
    "drm_string": "steam",
    "platforms_string": "linux,mac,windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "type": "game",
        "name": "Pillars of Eternity II: Deadfire",
        "slug": "pillars-of-eternity-ii-deadfire",
        "cover": "c9fbf5f0-8c31-462a-a307-42bbe819e0d0.jpeg",
        "bundles": [],
        "price": {
          "JPY": 396000,
          "RUB": 298100,
          "AUD": 4599,
          "CAD": 4399,
          "EUR": 3999,
          "USD": 3999,
          "GBP": 2999
        },
        "platforms": {
          "linux": true,
          "mac": true,
          "windows": true
        },
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "fullPrice": {
          "CAD": 5699,
          "USD": 4999,
          "EUR": 4599,
          "GBP": 3299,
          "AUD": 6799
        },
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 308880,
          "RUB": 232518,
          "AUD": 3587,
          "CAD": 3431,
          "EUR": 3119,
          "USD": 3119,
          "GBP": 2339
        },
        "current_discount": {
          "percent": 0.22,
          "display_percentage": true,
          "until": "2021-09-21T15:59:00.000Z",
          "from": "2021-09-19T07:01:00.464Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "linux,mac,windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Standard Edition"
      },
      {
        "type": "game",
        "name": "Pillars of Eternity II: Deadfire - Obsidian Edition",
        "slug": "pillars-of-eternity-ii-deadfire-obsidian-edition",
        "cover": "238f1966-1255-4d38-8f4b-c2ca18471fa6.jpeg",
        "bundles": [],
        "price": {
          "JPY": 594000,
          "RUB": 447500,
          "AUD": 6950,
          "CAD": 6599,
          "EUR": 5999,
          "USD": 5999,
          "GBP": 4499
        },
        "platforms": {
          "linux": true,
          "mac": true,
          "windows": true
        },
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "fullPrice": {
          "AUD": 10199,
          "GBP": 5799,
          "EUR": 6999,
          "USD": 7499,
          "CAD": 8599
        },
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 463320,
          "RUB": 349050,
          "AUD": 5421,
          "CAD": 5147,
          "EUR": 4679,
          "USD": 4679,
          "GBP": 3509
        },
        "current_discount": {
          "percent": 0.22,
          "display_percentage": true,
          "until": "2021-09-21T15:59:00.000Z",
          "from": "2021-09-19T07:01:00.464Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "linux,mac,windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Obsidian Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [
      "pillars-of-eternity-ii-deadfire-beast-of-winter",
      "pillars-of-eternity-ii-deadfire-the-forgotten-sanctum",
      "pillars-of-eternity-ii-deadfire-explorers-pack",
      "pillars-of-eternity-ii-deadfire-season-pass"
    ],
    "edition_name": "Obsidian Edition",
    "recommendations": [
      "pillars-of-eternity-ii-deadfire-explorers-pack",
      "pillars-of-eternity-definitive-edition",
      "pillars-of-eternity-ii-deadfire-season-pass",
      "pillars-of-eternity-the-white-march-part-ii",
      "pillars-of-eternity-expansion-pass",
      "pillars-of-eternity-ii-deadfire-beast-of-winter",
      "pillars-of-eternity-hero-edition",
      "pillars-of-eternity-the-white-march-1",
      "exanima",
      "total-war-rome-ii-emperor-edition",
      "endless-legend",
      "silent-hunter-5-battle-of-the-atlantic",
      "the-crew-ultimate-edition",
      "the-elder-scrolls-iv-oblivionr-game-of-the-year-edition-deluxe",
      "thea-the-awakening"
    ],
    "recommendations_challenger": [
      "pillars-of-eternity-ii-deadfire-explorers-pack",
      "pillars-of-eternity-ii-deadfire",
      "pillars-of-eternity-definitive-edition",
      "pillars-of-eternity-ii-deadfire-season-pass",
      "pillars-of-eternity-the-white-march-part-ii",
      "pillars-of-eternity-expansion-pass",
      "pillars-of-eternity-ii-deadfire-beast-of-winter",
      "pillars-of-eternity-hero-edition",
      "pillars-of-eternity-the-white-march-1",
      "exanima",
      "total-war-rome-ii-emperor-edition",
      "endless-legend",
      "silent-hunter-5-battle-of-the-atlantic",
      "the-crew-ultimate-edition",
      "the-elder-scrolls-iv-oblivionr-game-of-the-year-edition-deluxe"
    ],
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "Game Informer",
        "message": "\"A richly imagined seafaring setting lends novelty to what is ultimately an evolved iteration of very traditional isometric RPG fun\"",
        "url": "http://www.gameinformer.com/games/pillars_of_eternity_ii_deadfire/b/pc/archive/2018/05/08/game-informer-review-pillars-of-eternity-ii-deadfire.aspx",
        "displayScore": "8.8 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/gameinformer.jpg",
        "author": "Matt Miller"
      },
      {
        "scoreType": "text",
        "outletName": "PC Gamer",
        "message": "\"A massive, bountiful RPG with richly descriptive writing, a well-realised setting, and deep tactical combat.\"",
        "url": "https://www.pcgamer.com/pillars-of-eternity-2-deadfire-review/",
        "displayScore": "88 / 100",
        "outletImage": "https://cdn.fanatical.com/production/logos/pcgamer.jpg",
        "author": "Andy Kelly"
      },
      {
        "scoreType": "text",
        "outletName": "IGN",
        "message": "\"Pillars of Eternity 2: Deadfire improves upon the Pillars of Eternity formula in nearly every way, creating an RPG loaded with both strong combat and important, character-defining choices that frequently have an impact on your numerous and deep side-story adventures.\"",
        "url": "http://www.ign.com/articles/2018/05/08/pillars-of-eternity-2-deadfire-review",
        "displayScore": "8.5 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/ign.jpg",
        "author": "DM Schmeyer"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/5765/pillars-of-eternity-ii-deadfire",
    "opencriticScoreString": "89% Mighty",
    "opencriticReviewCount": 85,
    "opencriticPercentRecommended": 90,
    "openCriticScore": 89,
    "videos": [
      {
        "id": "rn7P7PvtGoM",
        "title": "Pillars of Eternity 2 Deadfire First Minutes Walkthrough",
        "date": "2021-06-02T07:00:12Z",
        "thumbnail_url": "https://i.ytimg.com/vi/rn7P7PvtGoM/hqdefault.jpg"
      },
      {
        "id": "Wx7lLP91LTo",
        "title": "Pillars of Eternity II: Deadfire - How to unlock the Secret Ending?",
        "date": "2018-05-08T19:58:45Z",
        "thumbnail_url": "https://i.ytimg.com/vi/Wx7lLP91LTo/hqdefault.jpg"
      },
      {
        "id": "frAc6gw67wA",
        "title": "The Holyslayer Pillars of Eternity Deadfire Complete Build",
        "date": "2018-07-12T15:47:28Z",
        "thumbnail_url": "https://i.ytimg.com/vi/frAc6gw67wA/hqdefault.jpg"
      },
      {
        "id": "fCXagRk-USg",
        "title": "Pillars of Eternity II: Deadfire Opinion",
        "date": "2019-12-15T20:02:54Z",
        "thumbnail_url": "https://i.ytimg.com/vi/fCXagRk-USg/hqdefault.jpg"
      },
      {
        "id": "HglFT2UEmQM",
        "title": "Pillars of Eternity 2",
        "date": "2021-08-22T16:55:26Z",
        "thumbnail_url": "https://i.ytimg.com/vi/HglFT2UEmQM/hqdefault.jpg"
      },
      {
        "id": "lFnmmdymNPc",
        "title": "Pillars of Eternity 2 (Evil) - Path of the Damned - Arrival at the Engwithan Digsite",
        "date": "2021-09-01T07:28:18Z",
        "thumbnail_url": "https://i.ytimg.com/vi/lFnmmdymNPc/hqdefault.jpg"
      },
      {
        "id": "XeLPGC04wX8",
        "title": "PILLARS OF ETERNITY II: DEADFIRE - GAME TRAILER",
        "date": "2017-12-20T18:00:02Z",
        "thumbnail_url": "https://i.ytimg.com/vi/XeLPGC04wX8/hqdefault.jpg"
      },
      {
        "id": "SA6Ag5_ojZY",
        "title": "Cash + Conversation (Path of the Damned Let&#39;s Roleplay Pillars of Eternity 2: Deadfire) #9",
        "date": "2018-05-13T23:09:40Z",
        "thumbnail_url": "https://i.ytimg.com/vi/SA6Ag5_ojZY/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "XsUXHhAAAB4AjNYl",
        "uid": "pillars-of-eternity-ii-deadfire-obsidian-edition-whats-included-steam-pc",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22XsUXHhAAAB4AjNYl%22%29+%5D%5D",
        "tags": [
          "Pillars of Eternity II: Deadfire",
          "Obsidian Edition",
          "Obsidian",
          "RPG",
          "Isometric",
          "Versus Evil",
          "Steam PC"
        ],
        "first_publication_date": "2020-05-20T15:28:02+0000",
        "last_publication_date": "2020-05-20T15:28:02+0000",
        "slugs": [
          "pillars-of-eternity-ii-deadfire-obsidian-edition---whats-included"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2020-05-20T15:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Pillars of Eternity II: Deadfire Obsidian Edition - What's included",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/d1cced0e-02e1-432b-8c3f-c23245702e2a_pillars-of-eternity-ii-deadfire-beast-of-winter-72116.jpg?auto=compress,format&rect=0,0,1200,675&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/d1cced0e-02e1-432b-8c3f-c23245702e2a_pillars-of-eternity-ii-deadfire-beast-of-winter-72116.jpg?auto=compress,format&rect=0,0,1200,675&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/d1cced0e-02e1-432b-8c3f-c23245702e2a_pillars-of-eternity-ii-deadfire-beast-of-winter-72116.jpg?auto=compress,format&rect=0,0,1200,675&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/d1cced0e-02e1-432b-8c3f-c23245702e2a_pillars-of-eternity-ii-deadfire-beast-of-winter-72116.jpg?auto=compress,format&rect=0,0,1200,675&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "What you'll get in Obsidian Entertainment's latest RPG in the multi-award-winning series",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "WubdOCIAAF_Kxe_d",
        "uid": "top-pirate-games-on-steam-pc--the-ones-to-treasure",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22WubdOCIAAF_Kxe_d%22%29+%5D%5D",
        "tags": [
          "The Secret of Monkey Island",
          "Assassin's Creed VI: Black Flag",
          "Pillars of Eternity II: Deadfire",
          "Blood & Gold: Caribbean",
          "Sid Meier's Pirates!",
          "MMORPG"
        ],
        "first_publication_date": "2018-04-30T15:40:23+0000",
        "last_publication_date": "2020-12-22T15:11:36+0000",
        "slugs": [
          "top-pirate-games-on-steam-pc--the-ones-to-treasure",
          "top-pirate-games-on-steam-pc"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2019-06-17T14:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Top pirate games on Steam PC – The ones to treasure",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/3be398b4d53ec97416567a0212a3f0b8c3598bac_top-pirates-social.jpg?auto=compress,format",
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/94d3021c9e222fc2b29ac7590126e59172f3700a_top-pirates-social.jpg?auto=compress,format"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/9e7ebee6842ea7ed146f4dc9717e340597604882_top-pirates-social.jpg?auto=compress,format"
            },
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/93af0a3559d168e5e8640f6e826aac584c635dce_top-pirates-social.jpg?auto=compress,format"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Current and upcoming games that are swashbuckling fun",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": [
        {
          "_id": "612f8870e5364e1c833410d9",
          "slug": "pillars-of-eternity-ii-deadfire-obsidian-edition",
          "rating": 5,
          "display_name": "the chad isometric enjoyer",
          "title": "Two steps forward, one step back",
          "text": "I thoroughly enjoyed this game but felt the story was weaker in comparison to the first Pillars of Eternity. I will say that the most massive improvement in this game was the multiclass system as it allowed me to theorycraft which I have always found personally enjoyable. They also added a ship minigame which is tolerable imo but not the reason I enjoy this game. \n\nAlso the party limit in this one is reduced by one, so max party limit of 5 in game companions or ones you've created at the taverns.  As for the two main dlcs, I enjoyed Beasts of Winter but felt that seeker, slayer, survivor was kind of a slog to get through.\n\nI'd still recommend this game if you're into party based isometric games though. Also there are to modes of playing turn-based and the regular stop and pause mechanic with the spacebar. ",
          "date": "2021-09-01T14:17:40.114Z",
          "staff_review": false,
          "recommended": true,
          "likes": 1,
          "locale": "en",
          "product_id": "5af1a9c91d30f7bbe26c063c",
          "version_id": "612f8b848b411300a5468b13",
          "published": true,
          "has_active_version": true,
          "removed": false
        },
        {
          "_id": "612de7f58c172940e1cf989f",
          "slug": "pillars-of-eternity-ii-deadfire-obsidian-edition",
          "rating": 5,
          "display_name": "Sam Jones",
          "title": "Pillars of Eternity II: Deadfire - Obsidian Edition Review",
          "text": "With a deeper narrative and exploration on both land and sea, players can immerse themselves in the world of Eora like never before. Thanks to its multiple companions and customizable ship options, you'll have a blast when you set sail in Pillars of Eternity II: Deadfire.",
          "date": "2021-08-31T08:27:33.235Z",
          "staff_review": true,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "5af1a9c91d30f7bbe26c063c",
          "version_id": "612de7f58c172940e1cf989e",
          "published": true,
          "has_active_version": true
        }
      ]
    },
    "userReviewSummary": {
      "rating_score": 5,
      "total_ratings": 6,
      "percent_recommended": 71,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 0,
        "four_star_percentage": 0,
        "five_star_percentage": 100
      },
      "reviewLocales": [
        "en"
      ],
      "total_written_reviews": 2
    },
    "relatedHits": [
      {
        "product_id": "5af30cec1d30f7bbe26c0a8f",
        "sku": "PCD9088",
        "name": "Pillars of Eternity II: Deadfire - Season Pass DLC",
        "slug": "pillars-of-eternity-ii-deadfire-season-pass",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "effed163-3a5f-4d41-b51d-7eb17bcacdcc.jpeg",
        "tiered": false,
        "discount_percent": 18,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 15.36,
          "EUR": 20.49,
          "USD": 20.49,
          "CAD": 22.54,
          "AUD": 27.87,
          "RUB": 1311.18,
          "JPY": 2029.5
        },
        "fullPrice": {
          "GBP": 18.74,
          "EUR": 24.99,
          "USD": 24.99,
          "CAD": 27.49,
          "AUD": 33.99,
          "RUB": 1599,
          "JPY": 2475
        },
        "operating_systems": [
          "windows",
          "mac",
          "linux"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Steam trading cards",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1632034860,
        "available_valid_until": 1632239940,
        "release_date": 1525737600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "f9f99068-d370-46ab-8506-787e6199fef2.jpg",
          "73fb9a11-57a5-43ea-aa9a-429389dba11c.jpg",
          "a8a2af36-b1d1-4ed0-b42a-245cd82d3428.jpg",
          "860d12d9-1fff-41ea-95ad-416d09d9c3fd.jpg",
          "f8080c68-d319-42bf-8767-2f494203fa99.jpg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 0,
          "ESRB": 0
        },
        "objectID": "5346084002"
      },
      {
        "product_id": "5b61ab95ce00e67512e1f55e",
        "sku": "PCD9707",
        "name": "Pillars of Eternity II: Deadfire - Beast of Winter",
        "slug": "pillars-of-eternity-ii-deadfire-beast-of-winter",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "2a034e75-fb74-4036-adc0-54d382f93234.jpeg",
        "tiered": false,
        "discount_percent": 15,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 6.36,
          "EUR": 8.49,
          "USD": 8.49,
          "CAD": 9.34,
          "AUD": 10.19,
          "RUB": 594.15,
          "JPY": 840.65
        },
        "fullPrice": {
          "GBP": 7.49,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 10.99,
          "AUD": 11.99,
          "RUB": 699,
          "JPY": 989
        },
        "operating_systems": [
          "windows",
          "mac",
          "linux"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Steam trading cards",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "8MF9MWIgT5E"
        ],
        "available_valid_from": 1632034860,
        "available_valid_until": 1632239940,
        "release_date": 1533168000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "19140e7e-dbdd-46e6-b0a6-72cbf218d988.jpg",
          "3da668e8-876a-4e9f-9025-3e0698708b15.jpg",
          "a5e0eac2-6a07-48f5-90e1-0a104e5eacb9.jpg",
          "17a359b7-7dc7-4ae3-b7f7-0e69145666bc.jpg",
          "b69b3764-2d9d-4609-9afe-f172dd5a6645.jpg",
          "b205f101-9f33-4fc6-a535-7b47b53f8f78.jpg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 0,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5346762002"
      },
      {
        "product_id": "5af3102c1d30f7bbe26c0a96",
        "sku": "PCD9089",
        "name": "Pillars of Eternity II: Deadfire - Explorer's Pack DLC",
        "slug": "pillars-of-eternity-ii-deadfire-explorers-pack",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "4a9170f1-1fca-419c-af27-b7a931c8f6c9.jpeg",
        "tiered": false,
        "discount_percent": 16,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 9.47,
          "EUR": 12.63,
          "USD": 12.63,
          "CAD": 13.9,
          "AUD": 17.27,
          "RUB": 842.35,
          "JPY": 1252.15
        },
        "fullPrice": {
          "GBP": 11.24,
          "EUR": 14.99,
          "USD": 14.99,
          "CAD": 16.49,
          "AUD": 20.49,
          "RUB": 999,
          "JPY": 1485
        },
        "operating_systems": [
          "windows",
          "mac",
          "linux"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Steam trading cards",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1632034860,
        "available_valid_until": 1632239940,
        "release_date": 1525737600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "8b3cf068-f480-40e4-b548-6d11b534c886.jpg",
          "b208c9ea-15f8-458f-a4af-d74d0a444800.jpg",
          "150a2baa-3ff7-45d5-8a1f-761891c70db3.jpg",
          "fad431cc-d65d-4d55-abca-8d843992621d.jpg",
          "c8d5b7b8-9f61-402c-806a-af3529e8a9ed.jpg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 0,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5346086002"
      },
      {
        "product_id": "5c128bf4618657020ccd7391",
        "sku": "PCD10598",
        "name": "Pillars of Eternity II: Deadfire - The Forgotten Sanctum",
        "slug": "pillars-of-eternity-ii-deadfire-the-forgotten-sanctum",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "702aecfd-bd7d-496e-af79-f1459ecf18f7.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 7.49,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 10.99,
          "AUD": 14.5,
          "RUB": 784,
          "JPY": 989
        },
        "fullPrice": {
          "GBP": 7.49,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 10.99,
          "AUD": 14.5,
          "RUB": 784,
          "JPY": 989
        },
        "operating_systems": [
          "windows",
          "mac",
          "linux"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Steam trading cards",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1544572800,
        "available_valid_until": 32535216000,
        "release_date": 1544659200,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "2486b72c-d952-44f7-b5d6-439c819cf2b7.jpg",
          "829868cb-eeaf-4efd-abd5-abd80b4a2e61.jpg",
          "9bb0e623-e22c-4ff9-9e23-0a959168f367.jpg",
          "b573e9ee-d3cc-4dc6-8e69-8fa9bb11d365.jpg",
          "88af4b7e-030f-4e8b-b127-489883268184.jpg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 0,
          "ESRB": 17
        },
        "objectID": "5348093002"
      }
    ]
  },
  {
    "_id": "60ad2145ab8b39007d363df5",
    "__v": 27,
    "age": {
      "ACB": 18,
      "USK": 6,
      "PEGI": 18,
      "ESRB": 17
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_until": null,
      "valid_from": "2021-05-27T19:00:00.000Z"
    },
    "bundles": [],
    "catalina": true,
    "collections": [],
    "developers": [
      "Techland"
    ],
    "display_type": "game",
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "features": [
      "PvP",
      "Online PvP",
      "Online Coop",
      "Steam Achievements",
      "Full controller support",
      "Steam Trading Cards",
      "Steam Workshop",
      "Steam Cloud",
      "Valve AntiCheat enabled",
      "Includes level editor",
      "Remote Play on Tablet",
      "Remote Play on TV"
    ],
    "franchises": [
      "Dying Light"
    ],
    "free_redeem_code": null,
    "genres": [
      "Action",
      "RPG"
    ],
    "img": [
      {
        "alt": "STEAM_DL-The-Following-screen-5.png",
        "slug": "f934801c-9ae0-4d8b-85b2-a8ca3e46792e.png",
        "order": "99"
      },
      {
        "alt": "STEAM_DL-The-Following-screen-1.png",
        "slug": "2fb49a96-1a84-404d-a8d7-e02a60d1fc3e.png",
        "order": "99"
      },
      {
        "alt": "STEAM_DL-The-Following-screen-2",
        "slug": "8d702265-009d-4d3c-84c3-5e04718f737e.jpeg",
        "order": "99"
      },
      {
        "alt": "STEAM_DL-The-Following-screen-3.png",
        "slug": "4f47fec9-d4df-4f26-90cb-a999f8c42155.png",
        "order": "99"
      },
      {
        "alt": "STEAM_DL-The-Following-screen-4.png",
        "slug": "f7eef6d7-c7a1-4c04-86d4-0dfa3c015ef4.png"
      }
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish - Spain",
      "Dutch",
      "Polish",
      "Portuguese - Brazil",
      "Russian",
      "Korean",
      "Simplified Chinese",
      "Spanish - Latin America",
      "Japanese",
      "Thai",
      "Traditional Chinese",
      "Turkish",
      "Czech"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer",
      "Coop"
    ],
    "name": "Dying Light - Platinum Edition",
    "notice": {
      "legal": "DYING LIGHT & DYING LIGHT: THE FOLLOWING © Techland 2021. Published by Techland. All other trademarks and copyrights are the property of their respective owners."
    },
    "platform_specs": {
      "lin": {
        "rec": "<strong>RECOMMENDED:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Ubuntu 14.04 64-bit and newer recommended<br></li><li><strong>Processor:</strong> Intel® Core™ i5-4670K @3.4 GHz / AMD FX-8350 @4.0 GHz <br>\t</li><li><strong>Memory:</strong> 8 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> NVIDIA® GeForce® GTX 780 / AMD Radeon™ R9 290 (2GB VRAM)<br>       </li><li><strong>Additional Notes:</strong> JFS and XFS file systems are not supported</li></ul>",
        "min": "<strong>MINIMUM:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Ubuntu 14.04 64-bit and newer recommended<br></li><li><strong>Processor:</strong> Intel® Core™ i5-2500 @3.3 GHz / AMD FX-8320 @3.5 GHz<br></li><li><strong>Memory:</strong> 4 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> NVIDIA® GeForce® GTX 560 / AMD Radeon™ HD 6870 (1GB VRAM)<br>        </li><li><strong>Additional Notes:</strong> JFS and XFS file systems are not supported</li></ul>"
      },
      "mac": {
        "rec": "<strong>RECOMMENDED:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> macOS Sierra 10.12.1<br></li><li><strong>Processor:</strong> Intel® Core™ i7 @4.00GHz<br>\t</li><li><strong>Memory:</strong> 8 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> AMD Radeon™ R9 M395X (4GB VRAM)<br>    </li><li><strong>Additional Notes:</strong> Only AMD Radeon™ graphics cards are officially supported.</li></ul>",
        "min": "<strong>MINIMUM:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> macOS Sierra 10.12.1<br></li><li><strong>Processor:</strong> Intel® Core™ i5 @3.20GHz<br>    </li><li><strong>Memory:</strong> 4 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> AMD Radeon™ R9 M370X (2GB VRAM)<br>    </li><li><strong>Additional Notes:</strong> Only AMD Radeon™ graphics cards are officially supported.</li></ul>"
      },
      "win": {
        "rec": "<strong>RECOMMENDED:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows® 7 64-bit / Windows® 8 64-bit / Windows® 8.1 64-bit<br>\t</li><li><strong>Processor:</strong> Intel® Core™ i5-4670K @3.4 GHz / AMD FX-8350 @4.0 GHz <br>\t</li><li><strong>Memory:</strong> 8 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> NVIDIA® GeForce® GTX 780 / AMD Radeon™ R9 290 (2GB VRAM)<br>        </li><li><strong>DirectX®:</strong> Version 11<br>        </li><li><strong>Sound:</strong> DirectX® compatible<br>        </li><li><strong>Additional Notes:</strong> Laptop versions of graphics cards may work but are NOT officially supported.<br><br>Windows-compatible keyboard, mouse, optional controller (Xbox 360 Controller for Windows recommended)</li></ul>",
        "min": "<strong>MINIMUM:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows® 7 64-bit / Windows® 8 64-bit / Windows® 8.1 64-bit<br>\t</li><li><strong>Processor:</strong> Intel® Core™ i5-2500 @3.3 GHz / AMD FX-8320 @3.5 GHz<br>\t</li><li><strong>Memory:</strong> 4 GB RAM DDR3<br>\t</li><li><strong>Hard Drive:</strong> 40 GB free space<br>\t</li><li><strong>Graphics:</strong> NVIDIA® GeForce® GTX 560 / AMD Radeon™ HD 6870 (1GB VRAM)<br>        </li><li><strong>DirectX®:</strong> Version 11<br>        </li><li><strong>Sound:</strong> DirectX® compatible<br>        </li><li><strong>Additional Notes:</strong> Laptop versions of graphics cards may work but are NOT officially supported.<br><br>Windows-compatible keyboard, mouse, optional controller (Xbox 360 Controller for Windows recommended)</li></ul>"
      }
    },
    "platforms": {
      "linux": true,
      "mac": true,
      "windows": true
    },
    "price": {
      "JPY": 488000,
      "RUB": 438600,
      "AUD": 7795,
      "CAD": 5699,
      "EUR": 4999,
      "USD": 4999,
      "GBP": 3499
    },
    "publishers": [
      "Techland Publishing"
    ],
    "quotes": [],
    "regions_excluded": [
      {
        "_id": "60b0fea504bec80076e4cc8b",
        "code": "DE",
        "name": "Germany"
      },
      {
        "_id": "60cb0260f196760076e9f501",
        "code": "JP",
        "name": "Japan"
      },
      {
        "_id": "60d21222b2bd64007d54dcfb",
        "code": "RU",
        "name": "Russian Federation"
      },
      {
        "_id": "60d21222b2bd64007d54dcfa",
        "code": "AM",
        "name": "Armenia"
      },
      {
        "_id": "60d21222b2bd64007d54dcf9",
        "code": "AZ",
        "name": "Azerbaijan"
      },
      {
        "_id": "60d21222b2bd64007d54dcf8",
        "code": "BY",
        "name": "Belarus"
      },
      {
        "_id": "60d21222b2bd64007d54dcf7",
        "code": "GE",
        "name": "Georgia"
      },
      {
        "_id": "60d21222b2bd64007d54dcf6",
        "code": "KZ",
        "name": "Kazakhstan"
      },
      {
        "_id": "60d21222b2bd64007d54dcf5",
        "code": "KG",
        "name": "Kyrgyzstan"
      },
      {
        "_id": "60d21222b2bd64007d54dcf4",
        "code": "MD",
        "name": "Moldova, Republic of"
      },
      {
        "_id": "60d21222b2bd64007d54dcf3",
        "code": "TJ",
        "name": "Tajikistan"
      },
      {
        "_id": "60d21222b2bd64007d54dcf2",
        "code": "TM",
        "name": "Turkmenistan"
      },
      {
        "_id": "60d21222b2bd64007d54dcf1",
        "code": "UZ",
        "name": "Uzbekistan"
      },
      {
        "_id": "60d21222b2bd64007d54dcf0",
        "code": "UA",
        "name": "Ukraine"
      },
      {
        "_id": "60d21222b2bd64007d54dcef",
        "code": "AG",
        "name": "Antigua and Barbuda"
      },
      {
        "_id": "60d21222b2bd64007d54dcee",
        "code": "AR",
        "name": "Argentina"
      },
      {
        "_id": "60d21222b2bd64007d54dced",
        "code": "BB",
        "name": "Barbados"
      },
      {
        "_id": "60d21222b2bd64007d54dcec",
        "code": "BM",
        "name": "Bermuda"
      },
      {
        "_id": "60d21222b2bd64007d54dceb",
        "code": "BO",
        "name": "Bolivia, Plurinational State of"
      },
      {
        "_id": "60d21222b2bd64007d54dcea",
        "code": "BR",
        "name": "Brazil"
      },
      {
        "_id": "60d21222b2bd64007d54dce9",
        "code": "BS",
        "name": "Bahamas"
      },
      {
        "_id": "60d21222b2bd64007d54dce8",
        "code": "BZ",
        "name": "Belize"
      },
      {
        "_id": "60d21222b2bd64007d54dce7",
        "code": "CL",
        "name": "Chile"
      },
      {
        "_id": "60d21222b2bd64007d54dce6",
        "code": "CO",
        "name": "Colombia"
      },
      {
        "_id": "60d21222b2bd64007d54dce5",
        "code": "CR",
        "name": "Costa Rica"
      },
      {
        "_id": "60d21222b2bd64007d54dce4",
        "code": "CU",
        "name": "Cuba"
      },
      {
        "_id": "60d21222b2bd64007d54dce3",
        "code": "DM",
        "name": "Dominica"
      },
      {
        "_id": "60d21222b2bd64007d54dce2",
        "code": "DO",
        "name": "Dominican Republic"
      },
      {
        "_id": "60d21222b2bd64007d54dce1",
        "code": "EC",
        "name": "Ecuador"
      },
      {
        "_id": "60d21222b2bd64007d54dce0",
        "code": "FK",
        "name": "Falkland Islands (Malvinas)"
      },
      {
        "_id": "60d21222b2bd64007d54dcdf",
        "code": "GD",
        "name": "Grenada"
      },
      {
        "_id": "60d21222b2bd64007d54dcde",
        "code": "GF",
        "name": "French Guiana"
      },
      {
        "_id": "60d21222b2bd64007d54dcdd",
        "code": "GS",
        "name": "South Georgia and the South Sandwich Islands"
      },
      {
        "_id": "60d21222b2bd64007d54dcdc",
        "code": "GT",
        "name": "Guatemala"
      },
      {
        "_id": "60d21222b2bd64007d54dcdb",
        "code": "GY",
        "name": "Guyana"
      },
      {
        "_id": "60d21222b2bd64007d54dcda",
        "code": "HN",
        "name": "Honduras"
      },
      {
        "_id": "60d21222b2bd64007d54dcd9",
        "code": "HT",
        "name": "Haiti"
      },
      {
        "_id": "60d21222b2bd64007d54dcd8",
        "code": "JM",
        "name": "Jamaica"
      },
      {
        "_id": "60d21222b2bd64007d54dcd7",
        "code": "KN",
        "name": "Saint Kitts and Nevis"
      },
      {
        "_id": "60d21222b2bd64007d54dcd6",
        "code": "LC",
        "name": "Saint Lucia"
      },
      {
        "_id": "60d21222b2bd64007d54dcd5",
        "code": "MX",
        "name": "Mexico"
      },
      {
        "_id": "60d21222b2bd64007d54dcd4",
        "code": "NI",
        "name": "Nicaragua"
      },
      {
        "_id": "60d21222b2bd64007d54dcd3",
        "code": "PA",
        "name": "Panama"
      },
      {
        "_id": "60d21222b2bd64007d54dcd2",
        "code": "PE",
        "name": "Peru"
      },
      {
        "_id": "60d21222b2bd64007d54dcd1",
        "code": "PR",
        "name": "Puerto Rico"
      },
      {
        "_id": "60d21222b2bd64007d54dcd0",
        "code": "PY",
        "name": "Paraguay"
      },
      {
        "_id": "60d21222b2bd64007d54dccf",
        "code": "SR",
        "name": "Suriname"
      },
      {
        "_id": "60d21222b2bd64007d54dcce",
        "code": "SV",
        "name": "El Salvador"
      },
      {
        "_id": "60d21222b2bd64007d54dccd",
        "code": "UY",
        "name": "Uruguay"
      },
      {
        "_id": "60d21222b2bd64007d54dccc",
        "code": "VC",
        "name": "Saint Vincent and the Grenadines"
      },
      {
        "_id": "60d21222b2bd64007d54dccb",
        "code": "VE",
        "name": "Venezuela, Bolivarian Republic of"
      },
      {
        "_id": "60d21222b2bd64007d54dcca",
        "code": "CN",
        "name": "China"
      }
    ],
    "regions_included": [],
    "release": "2021-05-25T16:09:40.830Z",
    "seo": {
      "desc": "Dying Light - Platinum Edition rove an infected world where only the strongest will make it. Master your combat skills to fight monsters of all kinds, both human and the undead. Parkour through the roofs, craft weapons, and help other survivors while you’re confronting your own nightmares.",
      "title": null
    },
    "showReview": true,
    "slug": "dying-light-platinum-edition",
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "steam": {
      "packages": [],
      "dlc": [
        1300710,
        748340,
        748341,
        798540,
        798541,
        798543,
        1034630,
        1112520,
        325724,
        335810,
        302101,
        435111,
        325723,
        347090,
        798542,
        436080,
        436081,
        436082,
        1177880,
        1112521,
        1241570,
        1174581,
        1272090,
        1354960,
        1184350,
        1174580,
        1184351,
        1454750,
        1468290,
        1498210,
        1524890,
        1543420,
        1599030
      ],
      "release": "2021-05-27T19:00:00.000Z",
      "id": null,
      "type": "app"
    },
    "type": "game",
    "url": "https://dyinglightgame.com/?utm_source=Steam&amp;utm_medium=Link&amp;utm_campaign=Dying_Light",
    "video": [
      "7VkS3beywvk"
    ],
    "visible": {
      "valid_until": null,
      "valid_from": "2021-05-27T19:00:00.000Z"
    },
    "cover": "22ae3c59-9e66-4941-8763-f2e7c516c4ef.jpeg",
    "downloads": [],
    "template_type": "standard",
    "desc": "<p>Rove an infected world where only the strongest will make it. Master your combat skills to fight monsters of all kinds, both human and the undead. Parkour through the roofs, craft weapons, and help other survivors while you&#8217;re confronting your own nightmares.&#160;</p>&#10;<p>Now you can enjoy Dying Light to the fullest with the richest version of the acclaimed open world zombie survival game. Containing four DLCs and seventeen skin bundles, Dying Light: Platinum Edition brings together everything you need to explore all the post-apocalyptic world has to offer. Drive across Harran, as you spread carnage in your buggy, face and survive Bozak&#8217;s trials, explore new quarantine zones, and enjoy plenty of new skins and weapons!</p>&#10;<p><strong>Features:</strong></p>&#10;<p>- Dying Light &#8211; the full award-winning game.&#160;</p>&#10;<p>- Dying Light: The Following &#8211; a huge expansion complete with a new story, vast original map, and a customizable buggy to drive.</p>&#10;<p>- Dying Light: Bozak Horde &#8211; a challenging game mode with its own side story.</p>&#10;<p>- Cuisine &amp; Cargo &#8211; two additional quarantine zones.</p>&#10;<p>- Ultimate Survivor Bundle &#8211; exclusive weapons and outfits.</p>&#10;<p>- Crash Test Skin Pack &#8211; a madcap cosmetic pack.</p>&#10;<p>- Hellraid &#8211; a new game mode in a dark-fantasy setting.</p>&#10;<p>- A large collection of skins and weapons that will make slaughtering zombies even more fun:</p>&#10;<ul>&#10;<li>5th Anniversary Bundle</li>&#10;<li>Harran Ranger Bundle</li>&#10;<li>Gun Psycho Bundle</li>&#10;<li>Volatile Hunter Bundle</li>&#10;<li>White Death Bundle</li>&#10;<li>Vintage Gunslinger Bundle</li>&#10;<li>Rais Elite Bundle</li>&#10;<li>Godfather Bundle</li>&#10;<li>Harran Inmate Bundle</li>&#10;<li>Retrowave Bundle</li>&#10;<li>SHU Warrior Bundle</li>&#10;<li>Volkan Combat Armor Bundle</li>&#10;<li>Classified Operation Bundle</li>&#10;<li>Viking: Raiders of Harran Bundle</li>&#10;<li>Harran Tactical Unit Bundle</li>&#10;</ul>",
    "parent_slug": "dying-light-enhanced-edition",
    "supplier_id": "55db244ad3b050fe108b45de",
    "currentPrice": {
      "JPY": 488000,
      "RUB": 438600,
      "AUD": 7795,
      "CAD": 5699,
      "EUR": 4999,
      "USD": 4999,
      "GBP": 3499
    },
    "current_discount": {
      "percent": 0,
      "display_percentage": false
    },
    "drm_string": "steam",
    "platforms_string": "linux,mac,windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "type": "game",
        "name": "Dying Light: Bad Blood",
        "slug": "dying-light-bad-blood",
        "cover": "be54fcc7-581f-498e-865e-8e3c226310cd.jpeg",
        "bundles": [],
        "price": {
          "JPY": 215700,
          "RUB": 163900,
          "AUD": 3089,
          "CAD": 2599,
          "EUR": 1999,
          "USD": 1999,
          "GBP": 1549
        },
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 172560,
          "RUB": 131120,
          "AUD": 2471,
          "CAD": 2079,
          "EUR": 1599,
          "USD": 1599,
          "GBP": 1239
        },
        "current_discount": {
          "percent": 0.2,
          "display_percentage": true,
          "until": "2021-09-22T15:59:00.000Z",
          "from": "2021-09-20T07:01:00.792Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Bad Blood"
      },
      {
        "type": "game",
        "name": "Dying Light: The Following – Enhanced Edition",
        "slug": "dying-light-enhanced-edition",
        "cover": "c2762fdd-8cb7-44a5-83f0-7da657a1f7f5.jpeg",
        "bundles": [],
        "price": {
          "JPY": 298000,
          "RUB": 264100,
          "AUD": 4795,
          "CAD": 3399,
          "EUR": 2999,
          "USD": 2999,
          "GBP": 2099
        },
        "platforms": {
          "linux": true,
          "mac": true,
          "windows": true
        },
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "fullPrice": {
          "CAD": 5999,
          "USD": 5999,
          "EUR": 4999,
          "GBP": 3999,
          "AUD": 8149
        },
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 298000,
          "RUB": 264100,
          "AUD": 4795,
          "CAD": 3399,
          "EUR": 2999,
          "USD": 2999,
          "GBP": 2099
        },
        "current_discount": {
          "percent": 0,
          "display_percentage": false
        },
        "drm_string": "steam",
        "platforms_string": "linux,mac,windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "The Following – Enhanced Edition"
      },
      {
        "bundles": [],
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "Dying Light - Platinum Edition",
        "platforms": {
          "linux": true,
          "mac": true,
          "windows": true
        },
        "price": {
          "JPY": 488000,
          "RUB": 438600,
          "AUD": 7795,
          "CAD": 5699,
          "EUR": 4999,
          "USD": 4999,
          "GBP": 3499
        },
        "slug": "dying-light-platinum-edition",
        "type": "game",
        "cover": "22ae3c59-9e66-4941-8763-f2e7c516c4ef.jpeg",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 488000,
          "RUB": 438600,
          "AUD": 7795,
          "CAD": 5699,
          "EUR": 4999,
          "USD": 4999,
          "GBP": 3499
        },
        "current_discount": {
          "percent": 0,
          "display_percentage": false
        },
        "drm_string": "steam",
        "platforms_string": "linux,mac,windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Platinum Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [
      "dying-light-vintage-gunslinger-bundle",
      "dying-light-gun-psycho-bundle",
      "dying-light-harran-ranger-bundle",
      "dying-light-volatile-hunter-bundle",
      "dying-light-white-death-bundle",
      "dying-light-rais-elite-bundle",
      "dying-light-godfather-bundle",
      "dying-light-shu-warrior-bundle",
      "dying-light-5-th-anniversary-bundle",
      "dying-light-volkan-combat-armor",
      "dying-light-retrowave-bundle",
      "dying-light-classified-operation-bundle",
      "dying-light-harran-tactical-unit",
      "dying-light-savvy-gamer-bundle",
      "dying-light-harran-inmate-bundle",
      "dying-light-astronaut-bundle",
      "dying-light-viking-raiders-of-harran",
      "dying-light-hellraid",
      "dying-light-the-following",
      "dying-light-season-pass"
    ],
    "edition_name": "Platinum Edition",
    "recommendations": [
      "thea-the-awakening",
      "zombie-army-4-dead-war-season-pass-one",
      "endless-legend",
      "space-engineers",
      "the-crew-ultimate-edition",
      "zombie-army-4-dead-war-season-pass-two",
      "roguebook",
      "this-war-of-mine",
      "everhood",
      "snk-40-th-anniversary-collection",
      "dragon-ball-z-kakarot-ultimate-edition",
      "predator-hunting-grounds-predator-bundle-edition",
      "the-incredible-adventures-of-van-helsing-final-cut",
      "payday-2-weapon-color-pack-2",
      "metro-last-light-redux"
    ],
    "recommendations_challenger": [
      "thea-the-awakening",
      "zombie-army-4-dead-war-season-pass-one",
      "endless-legend",
      "space-engineers",
      "the-crew-ultimate-edition",
      "zombie-army-4-dead-war-season-pass-two",
      "roguebook",
      "this-war-of-mine",
      "everhood",
      "snk-40-th-anniversary-collection",
      "dragon-ball-z-kakarot-ultimate-edition",
      "predator-hunting-grounds-predator-bundle-edition",
      "the-incredible-adventures-of-van-helsing-final-cut",
      "payday-2-weapon-color-pack-2",
      "metro-last-light-redux"
    ],
    "videos": [
      {
        "id": "sNztJuOPc_E",
        "title": "Dying Light Platinum Edition Gameplay",
        "date": "2021-09-16T15:34:42Z",
        "thumbnail_url": "https://i.ytimg.com/vi/sNztJuOPc_E/hqdefault.jpg"
      },
      {
        "id": "hbErCjgZ1fo",
        "title": "Dying Light Platinum Edition Gameplay #Dylinglight2 #radeon #gaming #AMD #playstation #walkthrough",
        "date": "2021-06-07T10:57:19Z",
        "thumbnail_url": "https://i.ytimg.com/vi/hbErCjgZ1fo/hqdefault.jpg"
      },
      {
        "id": "yIZrWdbiXYM",
        "title": "Dying Light: Platinum Edition reach highest peak of harran and capture military base",
        "date": "2021-06-29T04:24:50Z",
        "thumbnail_url": "https://i.ytimg.com/vi/yIZrWdbiXYM/hqdefault.jpg"
      },
      {
        "id": "i0pEZuaheFQ",
        "title": "Dying Light - Platinum Edition - Jade die",
        "date": "2021-05-30T15:11:19Z",
        "thumbnail_url": "https://i.ytimg.com/vi/i0pEZuaheFQ/hqdefault.jpg"
      },
      {
        "id": "C0hJ9h17mOE",
        "title": "Dying Light (Latest Update) i5 7300HQ GTX 1050 8GB RAM (All Settings Tested)",
        "date": "2018-04-20T19:28:30Z",
        "thumbnail_url": "https://i.ytimg.com/vi/C0hJ9h17mOE/hqdefault.jpg"
      },
      {
        "id": "1RTJXdzEMQ4",
        "title": "Dying Light Walkthrough GamePlay - Meet Rahim | Part 1 | Dying Light Platinum Edition",
        "date": "2021-06-24T15:41:04Z",
        "thumbnail_url": "https://i.ytimg.com/vi/1RTJXdzEMQ4/hqdefault.jpg"
      },
      {
        "id": "Jws_JnSH76E",
        "title": "Dying Light Platinum Hunt",
        "date": "2021-02-12T06:58:42Z",
        "thumbnail_url": "https://i.ytimg.com/vi/Jws_JnSH76E/hqdefault.jpg"
      },
      {
        "id": "J4QE5dOzuxs",
        "title": "Dying Light Platinum Hunt",
        "date": "2021-02-12T07:14:10Z",
        "thumbnail_url": "https://i.ytimg.com/vi/J4QE5dOzuxs/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "YToLhBAAACIARV_H",
        "uid": "dying-light-platinum-edition-whats-included-steam-pc",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YToLhBAAACIARV_H%22%29+%5D%5D",
        "tags": [
          "What's Included",
          "Steam PC",
          "Zombies"
        ],
        "first_publication_date": "2021-09-09T14:15:03+0000",
        "last_publication_date": "2021-09-09T14:16:21+0000",
        "slugs": [
          "dying-light-platinum-edition---whats-included"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-09-09T14:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Dying Light Platinum Edition - What's included",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/91c9a147-975c-45d5-bdc1-4a313e34b4c4_ss_d7e781ddd8ea78d5c8fedd27e0c1d02425cd91eb.1920x1080.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/91c9a147-975c-45d5-bdc1-4a313e34b4c4_ss_d7e781ddd8ea78d5c8fedd27e0c1d02425cd91eb.1920x1080.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/91c9a147-975c-45d5-bdc1-4a313e34b4c4_ss_d7e781ddd8ea78d5c8fedd27e0c1d02425cd91eb.1920x1080.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/91c9a147-975c-45d5-bdc1-4a313e34b4c4_ss_d7e781ddd8ea78d5c8fedd27e0c1d02425cd91eb.1920x1080.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "All the content in Techland's bumper edition of the popular open-world survival horror",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "YPFQlRAAACIAdI_6",
        "uid": "dying-light-2-stay-human-meet-monsters-confirmed-so-far-pc",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YPFQlRAAACIAdI_6%22%29+%5D%5D",
        "tags": [
          "Meet the ",
          "Steam PC"
        ],
        "first_publication_date": "2021-07-16T11:37:14+0000",
        "last_publication_date": "2021-07-16T11:37:14+0000",
        "slugs": [
          "dying-light-2-stay-human---meet-the-monsters-confirmed-so-far",
          "dying-light-2-stay-human---meet-the-monsters"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-07-16T11:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Dying Light 2 Stay Human - Meet the monsters confirmed so far",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/395a935c-5be0-429c-bf2f-107be4417f3f_dyinglight2.jpg?auto=compress,format&rect=0,0,1000,563&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/395a935c-5be0-429c-bf2f-107be4417f3f_dyinglight2.jpg?auto=compress,format&rect=0,0,1000,563&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/395a935c-5be0-429c-bf2f-107be4417f3f_dyinglight2.jpg?auto=compress,format&rect=0,0,1000,563&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/395a935c-5be0-429c-bf2f-107be4417f3f_dyinglight2.jpg?auto=compress,format&rect=0,0,1000,563&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "The zombies and beasts that await in Techland's survival horror sequel",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "relatedHits": [
      {
        "product_id": "611b948da473d40076128213",
        "sku": "PCD20739",
        "name": "Dying Light - Astronaut Bundle",
        "slug": "dying-light-astronaut-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "d566065e-e0e5-4581-aa96-c9bd7180c3ae.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 259,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 259,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "rP4lyndbUdc"
        ],
        "available_valid_from": 1629306000,
        "available_valid_until": 32535216000,
        "release_date": 1629306000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "ce66c2fd-2451-49d7-9195-c0e9f271e1d3.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-240p.webm"
          }
        ],
        "video_clip_poster": "KjK5j3MMpqsQn02O9r9miAA5pA0EJ-poster.jpg",
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5360536002"
      },
      {
        "product_id": "5f0eb892e5364e1c834ee98d",
        "sku": "PCD15990",
        "name": "Dying Light - Hellraid",
        "slug": "dying-light-hellraid",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "d68adedc-4320-4623-a867-54a00a3b9db3.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 6.99,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 13.49,
          "AUD": 15.5,
          "RUB": 835,
          "JPY": 980
        },
        "fullPrice": {
          "GBP": 6.99,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 13.49,
          "AUD": 15.5,
          "RUB": 835,
          "JPY": 980
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "6I7qnv3syzw",
          "k3QKG9k2a68"
        ],
        "available_valid_from": 1594767600,
        "available_valid_until": 32535216000,
        "release_date": 1597338000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "61a4f48b-ee06-4267-aaba-20406954ffa9.png",
          "a6fc1140-68f2-4d4f-864e-4a927d6c8338.png",
          "178c96bd-77b8-44b6-8df9-8232fb87db6b.png",
          "72196fc9-b8d0-4474-a1f4-41a5a00c200b.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-240p.webm"
          }
        ],
        "video_clip_poster": "mp6o1DWn9WSBJYLJwVM6C9Q8xo06Z-poster.jpg",
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5354402002"
      },
      {
        "product_id": "5f7446c2e5364e1c83efa0df",
        "sku": "PCD16900",
        "name": "Dying Light - Volkan Combat Armor",
        "slug": "dying-light-volkan-combat-armor",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "cb97680c-774b-44eb-b876-2f2f47466b3c.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1601643600,
        "available_valid_until": 32535216000,
        "release_date": 1601643600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "2d0d6888-4019-43a5-af15-88d6d610a8f0.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5355538002"
      },
      {
        "product_id": "6023ea35c477920085e243c3",
        "sku": "PCD18243",
        "name": "Dying Light - Viking: Raiders of Harran",
        "slug": "dying-light-viking-raiders-of-harran",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "088d6a85-677c-439a-8a92-1a565584dbc3.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.89,
          "EUR": 3.99,
          "USD": 3.99,
          "CAD": 4.65,
          "AUD": 5.95,
          "RUB": 348,
          "JPY": 398
        },
        "fullPrice": {
          "GBP": 2.89,
          "EUR": 3.99,
          "USD": 3.99,
          "CAD": 4.65,
          "AUD": 5.95,
          "RUB": 348,
          "JPY": 398
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "EGj_9kMhpaY"
        ],
        "available_valid_from": 1613055600,
        "available_valid_until": 32535216000,
        "release_date": 1613055600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "1257da9f-44ee-4293-8671-8a559276c7dc.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-240p.webm"
          }
        ],
        "video_clip_poster": "4nqLNXWqRlt2Y94x31KXfWNNmkl20-poster.jpg",
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5357252002"
      },
      {
        "product_id": "603631750d3184007e259f4d",
        "sku": "PCD18391",
        "name": "Dying Light - Harran Tactical Unit",
        "slug": "dying-light-harran-tactical-unit",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "5090c0e2-ec4d-43a8-8ecd-1eb535525c24.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 260,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 260,
          "JPY": 310
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "yhQi0HL_lnw"
        ],
        "available_valid_from": 1614276000,
        "available_valid_until": 32535216000,
        "release_date": 1614254400,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "773b3112-36fc-4467-9993-5db35a50340d.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5357435002"
      },
      {
        "product_id": "5e4ea3f0e5364e1c8355e1c9",
        "sku": "PCD14293",
        "name": "Dying Light - 5th Anniversary Bundle",
        "slug": "dying-light-5-th-anniversary-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "73b1001a-6cc8-4156-8489-b8da7a75521b.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 225,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 225,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1582221600,
        "available_valid_until": 32535216000,
        "release_date": 1582156800,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "a4b1316a-bd77-4850-bbb6-00c37f337337.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5352268002"
      },
      {
        "product_id": "5b190e84ce00e67512dfe56c",
        "sku": "PCD9280",
        "name": "Dying Light Season Pass DLC",
        "slug": "dying-light-season-pass",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "b9caf323-952f-4b00-9575-68a2e097c5ae.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 17.99,
          "EUR": 24.99,
          "USD": 24.99,
          "CAD": 29.99,
          "AUD": 42.95,
          "RUB": 1899,
          "JPY": 2480
        },
        "fullPrice": {
          "GBP": 17.99,
          "EUR": 24.99,
          "USD": 24.99,
          "CAD": 29.99,
          "AUD": 42.95,
          "RUB": 1899,
          "JPY": 2480
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [
          "Bandai and Dying Light"
        ],
        "video": [
          "s9ajnBRu09g"
        ],
        "available_valid_from": 1528368771,
        "available_valid_until": 32535216000,
        "release_date": 1422316800,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "c96dfb83-236c-44a2-b874-a64c33945cbb.jpg",
          "ff9c82a0-a424-4369-93e7-268dff5f142c.jpg",
          "7f212cb6-f721-4aac-9d96-abe83919dfd8.jpg",
          "d85bfb34-2f52-4a24-939e-b7e906afb178.jpg",
          "aa205829-5a43-4664-81bb-d4f2b3b76df4.jpg",
          "c50290f5-7a50-4339-b143-1dbfa3c0cdff.jpg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 0,
          "ESRB": 0
        },
        "objectID": "5346313002"
      },
      {
        "product_id": "60d30da271238a01f6ee90b4",
        "sku": "PCD19869",
        "name": "Dying Light - Savvy Gamer Bundle",
        "slug": "dying-light-savvy-gamer-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "cc6c400e-fb88-4ba2-8fa2-4339db262235.jpeg",
        "tiered": false,
        "discount_percent": 15,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.77,
          "EUR": 2.54,
          "USD": 2.54,
          "CAD": 2.88,
          "AUD": 3.82,
          "RUB": 217.6,
          "JPY": 263.5
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 256,
          "JPY": 310
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1632121260,
        "available_valid_until": 1632326340,
        "release_date": 1624554000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "36cf7f0d-9acf-4026-8c59-a48cdfd7cbd5.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5359459002"
      },
      {
        "product_id": "5fc90ca173af4a007e93e253",
        "sku": "PCD17671",
        "name": "Dying Light - Classified Operation Bundle",
        "slug": "dying-light-classified-operation-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "3e01ed63-59d2-4d93-b97a-2ee41e73dbaa.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 263,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 263,
          "JPY": 310
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "5nZRKRs_NpQ"
        ],
        "available_valid_from": 1607011324,
        "available_valid_until": 32535216000,
        "release_date": 1606953600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "d3aec117-8d90-411a-8a54-2369b725b5b7.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5356609002"
      },
      {
        "product_id": "5d6d2c5d2c9b138168f3aa6d",
        "sku": "PCD12803",
        "name": "Dying Light - Rais Elite Bundle",
        "slug": "dying-light-rais-elite-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "01ff25cf-f645-40c8-a7ac-659b1e13be43.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 235,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 235,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "O9_BJbfeF7M"
        ],
        "available_valid_from": 1567378800,
        "available_valid_until": 32535216000,
        "release_date": 1566864000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "d0deb0ce-2482-4b44-b27b-50c08a34e224.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5350585002"
      },
      {
        "product_id": "5b1116afce00e67512dfd628",
        "sku": "PCD9239",
        "name": "Dying Light: The Following DLC",
        "slug": "dying-light-the-following",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "6b0443d0-4b86-4ed3-bff8-db20c4905c90.jpeg",
        "tiered": false,
        "discount_percent": 16,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 13.5,
          "EUR": 16.88,
          "USD": 16.88,
          "CAD": 16.88,
          "AUD": 22.8,
          "RUB": 1097.52,
          "JPY": 1822.44
        },
        "fullPrice": {
          "GBP": 15.99,
          "EUR": 19.99,
          "USD": 19.99,
          "CAD": 19.99,
          "AUD": 26.99,
          "RUB": 1299,
          "JPY": 2157
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [
          "Bandai and Dying Light"
        ],
        "video": [
          "8B_ldti4QGI"
        ],
        "available_valid_from": 1632034860,
        "available_valid_until": 1632239940,
        "release_date": 1454889600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "595ad72e-ae96-44d2-b6fa-2aca8ec15c15.jpg",
          "f530c3af-689d-4526-8560-fbeace3e44f3.jpg",
          "7055052c-68c2-4621-b93f-8ec4de5e7cf3.jpg",
          "fa2d2300-0878-48ee-b7a6-7eca7f1764ac.jpg",
          "f0ed2b58-7836-436f-8922-566e493bdc5c.jpg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 0,
          "ESRB": 0
        },
        "objectID": "5346251002"
      },
      {
        "product_id": "5d8b6ed2e5364e1c832f29ff",
        "sku": "PCD12985",
        "name": "Dying Light:  Godfather Bundle",
        "slug": "dying-light-godfather-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "501ed284-a701-4f7b-9eb0-4ca59b09025e.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 225,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 225,
          "JPY": 310
        },
        "operating_systems": [],
        "drm": [
          "steam"
        ],
        "features": [],
        "collections": [],
        "video": [],
        "available_valid_from": 1570114800,
        "available_valid_until": 32535216000,
        "release_date": 1570057200,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "2737889b-ea3a-4abe-8251-887b703eeaf3.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "ESRB": 17,
          "PEGI": 18
        },
        "objectID": "5350795002"
      },
      {
        "product_id": "5e2978ffe5364e1c8332a1b4",
        "sku": "PCD14050",
        "name": "Dying Light - Shu Warrior Bundle",
        "slug": "dying-light-shu-warrior-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "a25b9ee4-626f-4139-9634-8ffd9a5ffc6a.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 218,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 218,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1579788000,
        "available_valid_until": 32535216000,
        "release_date": 1566864000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "ef536f3c-7f45-4de8-b345-eb04866d0a6b.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5352105002"
      },
      {
        "product_id": "5d7f620de5364e1c832516a2",
        "sku": "PCD12930",
        "name": "Dying Light - Harran Ranger Bundle",
        "slug": "dying-light-harran-ranger-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "77b87da1-e42a-4e24-a0f5-62cd8e2336c2.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "fzWZ2EqkOWY"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1461024000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "34bf6afa-7ffc-48bd-9b23-88a75bccfddb.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 0,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5350745002"
      },
      {
        "product_id": "5d7f6211e5364e1c83251754",
        "sku": "PCD12931",
        "name": "Dying Light - Volatile Hunter Bundle",
        "slug": "dying-light-volatile-hunter-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "5f34d5b2-cd19-4768-8e53-e5d1caffe2bf.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "ogfBsuq3azg"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1461024000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "8c77120a-6764-40f1-b062-3b449a681f78.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 0,
          "ESRB": 0
        },
        "objectID": "5350746002"
      },
      {
        "product_id": "5bf68dc8618657020cccc5ae",
        "sku": "PCD10456",
        "name": "Dying Light - Vintage Gunslinger Bundle",
        "slug": "dying-light-vintage-gunslinger-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "19a84cbc-7705-48da-b15f-c623f78909ce.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 231,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 231,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "u6WLqhyWg98"
        ],
        "available_valid_from": 1542988800,
        "available_valid_until": 32535216000,
        "release_date": 1513641600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "dcbee51e-a929-43df-a5e4-e6ed881aea48.jpg"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-240p.webm"
          }
        ],
        "video_clip_poster": "g4x7rNOoJjT9BrEMx4zMiQNlR3NZj0uM5pxE-poster.jpg",
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5347947002"
      },
      {
        "product_id": "5d7f620ae5364e1c832515e7",
        "sku": "PCD12929",
        "name": "Dying Light - Gun Psycho Bundle",
        "slug": "dying-light-gun-psycho-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "4f454a03-6f9b-4340-92be-493dcfefe781.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "Q2s527JP4t0"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1461024000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "fcc93abd-6579-4e5d-978b-4a7bb4c7965a.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-240p.webm"
          }
        ],
        "video_clip_poster": "gqyx0R8Z9ESE6D9G8lRNi33nR45Vk-poster.jpg",
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 0,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5350744002"
      },
      {
        "product_id": "5d7f6214e5364e1c832517fc",
        "sku": "PCD12932",
        "name": "Dying Light - White Death Bundle",
        "slug": "dying-light-white-death-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "29b10b46-a797-4d25-bf05-20f8f4fe0de5.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "fullPrice": {
          "GBP": 1.99,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 2.99,
          "AUD": 4.5,
          "RUB": 226,
          "JPY": 298
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "i5Lb5w5fnh0"
        ],
        "available_valid_from": 1568588400,
        "available_valid_until": 32535216000,
        "release_date": 1513641600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5350747002"
      },
      {
        "product_id": "5f96edee01b6d900850da64e",
        "sku": "PCD17221",
        "name": "Dying Light - Retrowave Bundle",
        "slug": "dying-light-retrowave-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "e9976fdf-f07b-4a34-8ab5-a9faeb03bd3a.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 268,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 268,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "EkGEL0OwuH8"
        ],
        "available_valid_from": 1603726599,
        "available_valid_until": 32535216000,
        "release_date": 1576713600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "a83dbab1-fecc-4ea3-903a-68d936b30e2a.jpeg"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-240p.webm"
          }
        ],
        "video_clip_poster": "xWB4GD3Q4Jh5DDzA1j6KiwR7XG9z0-poster.jpg",
        "age_ratings": {
          "ESRB": 17,
          "PEGI": 18,
          "USK": 0,
          "ACB": 18
        },
        "objectID": "5356025002"
      },
      {
        "product_id": "60f82d89e6b7be007d6d3883",
        "sku": "PCD20376",
        "name": "Dying Light - Harran Inmate Bundle",
        "slug": "dying-light-harran-inmate-bundle",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "d474edbf-1759-4a94-9a46-6952d182263c.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 262,
          "JPY": 310
        },
        "fullPrice": {
          "GBP": 2.09,
          "EUR": 2.99,
          "USD": 2.99,
          "CAD": 3.39,
          "AUD": 4.5,
          "RUB": 262,
          "JPY": 310
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1626877075,
        "available_valid_until": 32535216000,
        "release_date": 1574726400,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "83ec90a1-d3a3-4ee8-bcec-afeb78bec8ef.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 18,
          "USK": 0,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5360053002"
      }
    ],
    "userReviewSummary": {},
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "Game Informer",
        "message": "\"Tense and full of adrenaline-fueled moments, Dying Light is a blast\"",
        "url": "http://www.gameinformer.com/games/dying_light/b/xboxone/archive/2015/02/02/dying-light-game-informer-review.aspx",
        "displayScore": "8.5 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/gameinformer.jpg",
        "author": "Brian Shea"
      },
      {
        "scoreType": "text",
        "outletName": "IGN",
        "message": "\"High-speed parkour and gruesome zombie massacres make Dying Light a blast, even if the story's just okay.\"",
        "url": "http://www.ign.com/articles/2015/01/27/dying-light-review",
        "displayScore": "8.5 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/ign.jpg",
        "author": "Mikel Reparaz"
      },
      {
        "scoreType": "text",
        "outletName": "Eurogamer",
        "message": "\"As a follow up to Dead Island, Dying Light represents an improvement on the technical front, but has lost some of its knockabout charm in the process. It shares its predecessors pace and shape, as things start on a relative high as you explore into the game's systems, but then tail off the hours tick by. Dying Light mixes up Techland's own recipe to enjoyable effect, but can't fully disguise its regurgitated flavour.\"",
        "url": "http://www.eurogamer.net/articles/2015-01-30-dying-light-review",
        "displayScore": "7 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/eurogamer.jpg",
        "author": "Dan Whitehead"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/123/dying-light",
    "opencriticScoreString": "73% Fair",
    "opencriticReviewCount": 107,
    "opencriticPercentRecommended": 46,
    "openCriticScore": 73
  },
  {
    "_id": "6123d0a388842a007dc4e7ef",
    "__v": 8,
    "age": {
      "ACB": 15,
      "USK": 16,
      "PEGI": 16,
      "ESRB": 17
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_from": "2021-08-24T04:00:00.000Z",
      "valid_until": null
    },
    "bundleCover": "ba7862b9-2879-46f6-9c28-f55dfecbaee0.jpeg",
    "bundles": [],
    "collections": [],
    "cover": "a5e9eaf2-8248-40ce-9901-eebfa62f2dee.jpeg",
    "developers": [
      "Cold Iron Studios"
    ],
    "display_type": "game",
    "downloads": [],
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "features": [
      "Online Coop",
      "Steam Achievements",
      "Full controller support"
    ],
    "franchises": [
      "Alien",
      "Aliens Fireteam Elite"
    ],
    "free_redeem_code": null,
    "genres": [
      "Action",
      "RPG"
    ],
    "img": [
      {
        "order": "99",
        "slug": "305cc082-0c12-4511-9f0f-90f19af38f8d.jpeg",
        "alt": "ss_a24fc14f8b7904edc12202784b1a8ff5c0c44ce6.1920x1080"
      },
      {
        "order": "99",
        "slug": "19c19633-a6e1-4e60-84b7-ab0bba71b842.jpeg",
        "alt": "ss_8ef24645a5381eb30593b5ac274565f0a1a0ff35.1920x1080"
      },
      {
        "order": "99",
        "slug": "7b31f3cc-5d42-4ab9-a371-a343cdb7b6d9.jpeg",
        "alt": "ss_ec31b17949ffade914b3876884e8a1b595027574.1920x1080"
      },
      {
        "order": "99",
        "slug": "b4e5e5b7-452f-4ad1-87c8-962d1f599344.jpeg",
        "alt": "ss_8a159ef7ebc3ab002eacf770efec57f0d51707af.1920x1080"
      },
      {
        "order": "99",
        "slug": "d333e53c-68c5-4ba3-bd09-3f5ca158ff60.jpeg",
        "alt": "ss_e96d14bfc2cb481eb5ed88f87d4b0c8bd1be8680.1920x1080"
      },
      {
        "order": "99",
        "slug": "61c8e37a-928c-40b9-821d-b5ab3d8f5f40.jpeg",
        "alt": "ss_da83f9641b1b96fc29c7d9cdc9bf2fc8f27a52d9.1920x1080"
      },
      {
        "order": "99",
        "slug": "5f995cea-21b1-4fed-a1ef-9e6c183d8311.jpeg",
        "alt": "ss_660792b22144072514e995462007cb8db5ea7c75.1920x1080"
      },
      {
        "order": "99",
        "slug": "4274c527-68f4-4585-b91b-b367ea519801.jpeg",
        "alt": "ss_16213148c39e4f3378a0e172836e58bcaa02476e.1920x1080"
      },
      {
        "slug": "3df4517d-9224-49a4-8d2b-c8e0e2e4f00f.jpeg",
        "alt": "ss_28a1216a27407546f67696448250a96beaeaeb58.1920x1080"
      }
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish - Spain",
      "Portuguese - Brazil",
      "Russian",
      "Czech",
      "Japanese",
      "Korean",
      "Polish",
      "Simplified Chinese",
      "Traditional Chinese"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer",
      "Coop"
    ],
    "name": "Aliens: Fireteam Elite",
    "notice": {
      "legal": "Developed by Cold Iron Studios, LLC. © 2021 20th Century Studios. © 2021 COLD IRON STUDIOS, LLC. All rights reserved. All other trademarks, registered trademarks and their logos belong to their respective owners."
    },
    "platform_specs": {
      "win": {
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows 10<br></li><li><strong>Processor:</strong> AMD Ryzen 5 1600AF / Intel i5-7400<br></li><li><strong>Memory:</strong> 16 GB RAM<br></li><li><strong>Graphics:</strong> AMD RX 480 8GB / Nvidia GTX 1060 6GB<br></li><li><strong>DirectX:</strong> Version 11<br></li><li><strong>Network:</strong> Broadband Internet connection<br></li><li><strong>Storage:</strong> 30 GB available space<br></li><li><strong>Sound Card:</strong> Integrated or dedicated Direct X 11 compatible soundcard<br></li><li><strong>Additional Notes:</strong> High graphics settings, 1920x1080 screen resolution, 60FPS average</li></ul>",
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows 10<br></li><li><strong>Processor:</strong> AMD Athlon X4 950 / Intel i5-2500K<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> AMD R9 285 4GB / Nvidia GTX 760 4GB<br></li><li><strong>DirectX:</strong> Version 11<br></li><li><strong>Network:</strong> Broadband Internet connection<br></li><li><strong>Storage:</strong> 30 GB available space<br></li><li><strong>Sound Card:</strong> Integrated or dedicated Direct X 11 compatible soundcard<br></li><li><strong>Additional Notes:</strong> Minimum graphics settings, 1920x1080 screen resolution, 30FPS average</li></ul>"
      }
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 488000,
      "RUB": 341700,
      "AUD": 5495,
      "CAD": 4999,
      "EUR": 3999,
      "USD": 3999,
      "GBP": 3499
    },
    "publishers": [
      "Cold Iron Studios",
      "Focus Home Interactive"
    ],
    "quotes": [],
    "regions_excluded": [],
    "regions_included": [
      {
        "_id": "60ed76f694bf34007d34cae5",
        "code": "AD",
        "name": "Andorra"
      },
      {
        "_id": "60ed76f694bf34007d34cae4",
        "code": "AE",
        "name": "United Arab Emirates"
      },
      {
        "_id": "60ed76f694bf34007d34cae3",
        "code": "AF",
        "name": "Afghanistan"
      },
      {
        "_id": "60ed76f694bf34007d34cae2",
        "code": "AL",
        "name": "Albania"
      },
      {
        "_id": "60ed76f694bf34007d34cae1",
        "code": "AM",
        "name": "Armenia"
      },
      {
        "_id": "60ed76f694bf34007d34cae0",
        "code": "AO",
        "name": "Angola"
      },
      {
        "_id": "60ed76f694bf34007d34cadf",
        "code": "AQ",
        "name": "Antarctica"
      },
      {
        "_id": "60ed76f694bf34007d34cade",
        "code": "AT",
        "name": "Austria"
      },
      {
        "_id": "60ed76f694bf34007d34cadd",
        "code": "AX",
        "name": "Åland Islands"
      },
      {
        "_id": "60ed76f694bf34007d34cadc",
        "code": "AZ",
        "name": "Azerbaijan"
      },
      {
        "_id": "60ed76f694bf34007d34cadb",
        "code": "BA",
        "name": "Bosnia and Herzegovina"
      },
      {
        "_id": "60ed76f694bf34007d34cada",
        "code": "BE",
        "name": "Belgium"
      },
      {
        "_id": "60ed76f694bf34007d34cad9",
        "code": "BF",
        "name": "Burkina Faso"
      },
      {
        "_id": "60ed76f694bf34007d34cad8",
        "code": "BG",
        "name": "Bulgaria"
      },
      {
        "_id": "60ed76f694bf34007d34cad7",
        "code": "BH",
        "name": "Bahrain"
      },
      {
        "_id": "60ed76f694bf34007d34cad6",
        "code": "BI",
        "name": "Burundi"
      },
      {
        "_id": "60ed76f694bf34007d34cad5",
        "code": "BJ",
        "name": "Benin"
      },
      {
        "_id": "60ed76f694bf34007d34cad4",
        "code": "BL",
        "name": "Saint Barthélemy"
      },
      {
        "_id": "60ed76f694bf34007d34cad3",
        "code": "BV",
        "name": "Bouvet Island"
      },
      {
        "_id": "60ed76f694bf34007d34cad2",
        "code": "BW",
        "name": "Botswana"
      },
      {
        "_id": "60ed76f694bf34007d34cad1",
        "code": "BY",
        "name": "Belarus"
      },
      {
        "_id": "60ed76f694bf34007d34cad0",
        "code": "CD",
        "name": "Congo, the Democratic Republic of the"
      },
      {
        "_id": "60ed76f694bf34007d34cacf",
        "code": "CF",
        "name": "Central African Republic"
      },
      {
        "_id": "60ed76f694bf34007d34cace",
        "code": "CG",
        "name": "Congo"
      },
      {
        "_id": "60ed76f694bf34007d34cacd",
        "code": "CH",
        "name": "Switzerland"
      },
      {
        "_id": "60ed76f694bf34007d34cacc",
        "code": "CI",
        "name": "Côte d'Ivoire"
      },
      {
        "_id": "60ed76f694bf34007d34cacb",
        "code": "CK",
        "name": "Cook Islands"
      },
      {
        "_id": "60ed76f694bf34007d34caca",
        "code": "CM",
        "name": "Cameroon"
      },
      {
        "_id": "60ed76f694bf34007d34cac9",
        "code": "CW",
        "name": "Curaçao"
      },
      {
        "_id": "60ed76f694bf34007d34cac8",
        "code": "CY",
        "name": "Cyprus"
      },
      {
        "_id": "60ed76f694bf34007d34cac7",
        "code": "CZ",
        "name": "Czech Republic"
      },
      {
        "_id": "60ed76f694bf34007d34cac6",
        "code": "DE",
        "name": "Germany"
      },
      {
        "_id": "60ed76f694bf34007d34cac5",
        "code": "DJ",
        "name": "Djibouti"
      },
      {
        "_id": "60ed76f694bf34007d34cac4",
        "code": "DK",
        "name": "Denmark"
      },
      {
        "_id": "60ed76f694bf34007d34cac3",
        "code": "DZ",
        "name": "Algeria"
      },
      {
        "_id": "60ed76f694bf34007d34cac2",
        "code": "EE",
        "name": "Estonia"
      },
      {
        "_id": "60ed76f694bf34007d34cac1",
        "code": "EG",
        "name": "Egypt"
      },
      {
        "_id": "60ed76f694bf34007d34cac0",
        "code": "EH",
        "name": "Western Sahara"
      },
      {
        "_id": "60ed76f694bf34007d34cabf",
        "code": "ER",
        "name": "Eritrea"
      },
      {
        "_id": "60ed76f694bf34007d34cabe",
        "code": "ES",
        "name": "Spain"
      },
      {
        "_id": "60ed76f694bf34007d34cabd",
        "code": "ET",
        "name": "Ethiopia"
      },
      {
        "_id": "60ed76f694bf34007d34cabc",
        "code": "FI",
        "name": "Finland"
      },
      {
        "_id": "60ed76f694bf34007d34cabb",
        "code": "FO",
        "name": "Faroe Islands"
      },
      {
        "_id": "60ed76f694bf34007d34caba",
        "code": "FR",
        "name": "France"
      },
      {
        "_id": "60ed76f694bf34007d34cab9",
        "code": "GA",
        "name": "Gabon"
      },
      {
        "_id": "60ed76f694bf34007d34cab8",
        "code": "GB",
        "name": "United Kingdom"
      },
      {
        "_id": "60ed76f694bf34007d34cab7",
        "code": "GE",
        "name": "Georgia"
      },
      {
        "_id": "60ed76f694bf34007d34cab6",
        "code": "GF",
        "name": "French Guiana"
      },
      {
        "_id": "60ed76f694bf34007d34cab5",
        "code": "GG",
        "name": "Guernsey"
      },
      {
        "_id": "60ed76f694bf34007d34cab4",
        "code": "GH",
        "name": "Ghana"
      },
      {
        "_id": "60ed76f694bf34007d34cab3",
        "code": "GI",
        "name": "Gibraltar"
      },
      {
        "_id": "60ed76f694bf34007d34cab2",
        "code": "GL",
        "name": "Greenland"
      },
      {
        "_id": "60ed76f694bf34007d34cab1",
        "code": "GM",
        "name": "Gambia"
      },
      {
        "_id": "60ed76f694bf34007d34cab0",
        "code": "GN",
        "name": "Guinea"
      },
      {
        "_id": "60ed76f694bf34007d34caaf",
        "code": "GP",
        "name": "Guadeloupe"
      },
      {
        "_id": "60ed76f694bf34007d34caae",
        "code": "GQ",
        "name": "Equatorial Guinea"
      },
      {
        "_id": "60ed76f694bf34007d34caad",
        "code": "GR",
        "name": "Greece"
      },
      {
        "_id": "60ed76f694bf34007d34caac",
        "code": "GW",
        "name": "Guinea-Bissau"
      },
      {
        "_id": "60ed76f694bf34007d34caab",
        "code": "HM",
        "name": "Heard Island and McDonald Mcdonald Islands"
      },
      {
        "_id": "60ed76f694bf34007d34caaa",
        "code": "HR",
        "name": "Croatia"
      },
      {
        "_id": "60ed76f694bf34007d34caa9",
        "code": "HU",
        "name": "Hungary"
      },
      {
        "_id": "60ed76f694bf34007d34caa8",
        "code": "IE",
        "name": "Ireland"
      },
      {
        "_id": "60ed76f694bf34007d34caa7",
        "code": "IL",
        "name": "Israel"
      },
      {
        "_id": "60ed76f694bf34007d34caa6",
        "code": "IM",
        "name": "Isle of Man"
      },
      {
        "_id": "60ed76f694bf34007d34caa5",
        "code": "IQ",
        "name": "Iraq"
      },
      {
        "_id": "60ed76f694bf34007d34caa4",
        "code": "IR",
        "name": "Iran, Islamic Republic of"
      },
      {
        "_id": "60ed76f694bf34007d34caa3",
        "code": "IS",
        "name": "Iceland"
      },
      {
        "_id": "60ed76f694bf34007d34caa2",
        "code": "IT",
        "name": "Italy"
      },
      {
        "_id": "60ed76f694bf34007d34caa1",
        "code": "JE",
        "name": "Jersey"
      },
      {
        "_id": "60ed76f694bf34007d34caa0",
        "code": "JO",
        "name": "Jordan"
      },
      {
        "_id": "60ed76f694bf34007d34ca9f",
        "code": "KE",
        "name": "Kenya"
      },
      {
        "_id": "60ed76f694bf34007d34ca9e",
        "code": "KG",
        "name": "Kyrgyzstan"
      },
      {
        "_id": "60ed76f694bf34007d34ca9d",
        "code": "KM",
        "name": "Comoros"
      },
      {
        "_id": "60ed76f694bf34007d34ca9c",
        "code": "KW",
        "name": "Kuwait"
      },
      {
        "_id": "60ed76f694bf34007d34ca9b",
        "code": "KZ",
        "name": "Kazakhstan"
      },
      {
        "_id": "60ed76f694bf34007d34ca9a",
        "code": "LB",
        "name": "Lebanon"
      },
      {
        "_id": "60ed76f694bf34007d34ca99",
        "code": "LI",
        "name": "Liechtenstein"
      },
      {
        "_id": "60ed76f694bf34007d34ca98",
        "code": "LR",
        "name": "Liberia"
      },
      {
        "_id": "60ed76f694bf34007d34ca97",
        "code": "LS",
        "name": "Lesotho"
      },
      {
        "_id": "60ed76f694bf34007d34ca96",
        "code": "LT",
        "name": "Lithuania"
      },
      {
        "_id": "60ed76f694bf34007d34ca95",
        "code": "LU",
        "name": "Luxembourg"
      },
      {
        "_id": "60ed76f694bf34007d34ca94",
        "code": "LV",
        "name": "Latvia"
      },
      {
        "_id": "60ed76f694bf34007d34ca93",
        "code": "LY",
        "name": "Libya"
      },
      {
        "_id": "60ed76f694bf34007d34ca92",
        "code": "MA",
        "name": "Morocco"
      },
      {
        "_id": "60ed76f694bf34007d34ca91",
        "code": "MC",
        "name": "Monaco"
      },
      {
        "_id": "60ed76f694bf34007d34ca90",
        "code": "MD",
        "name": "Moldova, Republic of"
      },
      {
        "_id": "60ed76f694bf34007d34ca8f",
        "code": "ME",
        "name": "Montenegro"
      },
      {
        "_id": "60ed76f694bf34007d34ca8e",
        "code": "MF",
        "name": "Saint Martin (French part)"
      },
      {
        "_id": "60ed76f694bf34007d34ca8d",
        "code": "MG",
        "name": "Madagascar"
      },
      {
        "_id": "60ed76f694bf34007d34ca8c",
        "code": "MK",
        "name": "Macedonia, the Former Yugoslav Republic of"
      },
      {
        "_id": "60ed76f694bf34007d34ca8b",
        "code": "ML",
        "name": "Mali"
      },
      {
        "_id": "60ed76f694bf34007d34ca8a",
        "code": "MQ",
        "name": "Martinique"
      },
      {
        "_id": "60ed76f694bf34007d34ca89",
        "code": "MR",
        "name": "Mauritania"
      },
      {
        "_id": "60ed76f694bf34007d34ca88",
        "code": "MT",
        "name": "Malta"
      },
      {
        "_id": "60ed76f694bf34007d34ca87",
        "code": "MU",
        "name": "Mauritius"
      },
      {
        "_id": "60ed76f694bf34007d34ca86",
        "code": "MW",
        "name": "Malawi"
      },
      {
        "_id": "60ed76f694bf34007d34ca85",
        "code": "MZ",
        "name": "Mozambique"
      },
      {
        "_id": "60ed76f694bf34007d34ca84",
        "code": "NA",
        "name": "Namibia"
      },
      {
        "_id": "60ed76f694bf34007d34ca83",
        "code": "NC",
        "name": "New Caledonia"
      },
      {
        "_id": "60ed76f694bf34007d34ca82",
        "code": "NE",
        "name": "Niger"
      },
      {
        "_id": "60ed76f694bf34007d34ca81",
        "code": "NG",
        "name": "Nigeria"
      },
      {
        "_id": "60ed76f694bf34007d34ca80",
        "code": "NL",
        "name": "Netherlands"
      },
      {
        "_id": "60ed76f694bf34007d34ca7f",
        "code": "NO",
        "name": "Norway"
      },
      {
        "_id": "60ed76f694bf34007d34ca7e",
        "code": "OM",
        "name": "Oman"
      },
      {
        "_id": "60ed76f694bf34007d34ca7d",
        "code": "PF",
        "name": "French Polynesia"
      },
      {
        "_id": "60ed76f694bf34007d34ca7c",
        "code": "PL",
        "name": "Poland"
      },
      {
        "_id": "60ed76f694bf34007d34ca7b",
        "code": "PM",
        "name": "Saint Pierre and Miquelon"
      },
      {
        "_id": "60ed76f694bf34007d34ca7a",
        "code": "PS",
        "name": "Palestine, State of"
      },
      {
        "_id": "60ed76f694bf34007d34ca79",
        "code": "PT",
        "name": "Portugal"
      },
      {
        "_id": "60ed76f694bf34007d34ca78",
        "code": "QA",
        "name": "Qatar"
      },
      {
        "_id": "60ed76f694bf34007d34ca77",
        "code": "RE",
        "name": "Réunion"
      },
      {
        "_id": "60ed76f694bf34007d34ca76",
        "code": "RO",
        "name": "Romania"
      },
      {
        "_id": "60ed76f694bf34007d34ca75",
        "code": "RS",
        "name": "Serbia"
      },
      {
        "_id": "60ed76f694bf34007d34ca73",
        "code": "RW",
        "name": "Rwanda"
      },
      {
        "_id": "60ed76f694bf34007d34ca72",
        "code": "SA",
        "name": "Saudi Arabia"
      },
      {
        "_id": "60ed76f694bf34007d34ca71",
        "code": "SC",
        "name": "Seychelles"
      },
      {
        "_id": "60ed76f694bf34007d34ca70",
        "code": "SS",
        "name": "South Sudan"
      },
      {
        "_id": "60ed76f694bf34007d34ca6f",
        "code": "SE",
        "name": "Sweden"
      },
      {
        "_id": "60ed76f694bf34007d34ca6e",
        "code": "SH",
        "name": "Saint Helena, Ascension and Tristan da Cunha"
      },
      {
        "_id": "60ed76f694bf34007d34ca6d",
        "code": "SI",
        "name": "Slovenia"
      },
      {
        "_id": "60ed76f694bf34007d34ca6c",
        "code": "SK",
        "name": "Slovakia"
      },
      {
        "_id": "60ed76f694bf34007d34ca6b",
        "code": "SL",
        "name": "Sierra Leone"
      },
      {
        "_id": "60ed76f694bf34007d34ca6a",
        "code": "SM",
        "name": "San Marino"
      },
      {
        "_id": "60ed76f694bf34007d34ca69",
        "code": "SN",
        "name": "Senegal"
      },
      {
        "_id": "60ed76f694bf34007d34ca68",
        "code": "SO",
        "name": "Somalia"
      },
      {
        "_id": "60ed76f694bf34007d34ca67",
        "code": "ST",
        "name": "Sao Tome and Principe"
      },
      {
        "_id": "60ed76f694bf34007d34ca66",
        "code": "SX",
        "name": "Sint Maarten (Dutch part)"
      },
      {
        "_id": "60ed76f694bf34007d34ca65",
        "code": "SY",
        "name": "Syrian Arab Republic"
      },
      {
        "_id": "60ed76f694bf34007d34ca64",
        "code": "SZ",
        "name": "Swaziland"
      },
      {
        "_id": "60ed76f694bf34007d34ca63",
        "code": "TD",
        "name": "Chad"
      },
      {
        "_id": "60ed76f694bf34007d34ca62",
        "code": "TF",
        "name": "French Southern Territories"
      },
      {
        "_id": "60ed76f694bf34007d34ca61",
        "code": "TG",
        "name": "Togo"
      },
      {
        "_id": "60ed76f694bf34007d34ca60",
        "code": "TJ",
        "name": "Tajikistan"
      },
      {
        "_id": "60ed76f694bf34007d34ca5f",
        "code": "TM",
        "name": "Turkmenistan"
      },
      {
        "_id": "60ed76f694bf34007d34ca5e",
        "code": "TN",
        "name": "Tunisia"
      },
      {
        "_id": "60ed76f694bf34007d34ca5d",
        "code": "TR",
        "name": "Turkey"
      },
      {
        "_id": "60ed76f694bf34007d34ca5c",
        "code": "TZ",
        "name": "Tanzania, United Republic of"
      },
      {
        "_id": "60ed76f694bf34007d34ca5b",
        "code": "UA",
        "name": "Ukraine"
      },
      {
        "_id": "60ed76f694bf34007d34ca5a",
        "code": "UG",
        "name": "Uganda"
      },
      {
        "_id": "60ed76f694bf34007d34ca59",
        "code": "UZ",
        "name": "Uzbekistan"
      },
      {
        "_id": "60ed76f694bf34007d34ca58",
        "code": "VA",
        "name": "Holy See (Vatican City State)"
      },
      {
        "_id": "60ed76f694bf34007d34ca57",
        "code": "WF",
        "name": "Wallis and Futuna"
      },
      {
        "_id": "60ed76f694bf34007d34ca56",
        "code": "YE",
        "name": "Yemen"
      },
      {
        "_id": "60ed76f694bf34007d34ca55",
        "code": "YT",
        "name": "Mayotte"
      },
      {
        "_id": "60ed76f694bf34007d34ca54",
        "code": "ZA",
        "name": "South Africa"
      },
      {
        "_id": "60ed76f694bf34007d34ca53",
        "code": "ZM",
        "name": "Zambia"
      },
      {
        "_id": "60ed76f694bf34007d34ca52",
        "code": "ZW",
        "name": "Zimbabwe"
      },
      {
        "_id": "60ed76f694bf34007d34ca51",
        "code": "AS",
        "name": "American Samoa"
      },
      {
        "_id": "60ed76f694bf34007d34ca50",
        "code": "AU",
        "name": "Australia"
      },
      {
        "_id": "60ed76f694bf34007d34ca4f",
        "code": "BD",
        "name": "Bangladesh"
      },
      {
        "_id": "60ed76f694bf34007d34ca4e",
        "code": "BN",
        "name": "Brunei Darussalam"
      },
      {
        "_id": "60ed76f694bf34007d34ca4d",
        "code": "BT",
        "name": "Bhutan"
      },
      {
        "_id": "60ed76f694bf34007d34ca4c",
        "code": "CC",
        "name": "Cocos (Keeling) Islands"
      },
      {
        "_id": "60ed76f694bf34007d34ca4b",
        "code": "CX",
        "name": "Christmas Island"
      },
      {
        "_id": "60ed76f694bf34007d34ca4a",
        "code": "FJ",
        "name": "Fiji"
      },
      {
        "_id": "60ed76f694bf34007d34ca49",
        "code": "FM",
        "name": "Micronesia, Federated States of"
      },
      {
        "_id": "60ed76f694bf34007d34ca48",
        "code": "GU",
        "name": "Guam"
      },
      {
        "_id": "60ed76f694bf34007d34ca47",
        "code": "HK",
        "name": "Hong Kong"
      },
      {
        "_id": "60ed76f694bf34007d34ca46",
        "code": "ID",
        "name": "Indonesia"
      },
      {
        "_id": "60ed76f694bf34007d34ca45",
        "code": "IN",
        "name": "India"
      },
      {
        "_id": "60ed76f694bf34007d34ca44",
        "code": "IO",
        "name": "British Indian Ocean Territory"
      },
      {
        "_id": "60ed76f694bf34007d34ca43",
        "code": "KH",
        "name": "Cambodia"
      },
      {
        "_id": "60ed76f694bf34007d34ca42",
        "code": "KI",
        "name": "Kiribati"
      },
      {
        "_id": "60ed76f694bf34007d34ca41",
        "code": "KP",
        "name": "Korea, Democratic People's Republic of"
      },
      {
        "_id": "60ed76f694bf34007d34ca40",
        "code": "KR",
        "name": "Korea, Republic of"
      },
      {
        "_id": "60ed76f694bf34007d34ca3f",
        "code": "LA",
        "name": "Lao People's Democratic Republic"
      },
      {
        "_id": "60ed76f694bf34007d34ca3e",
        "code": "LK",
        "name": "Sri Lanka"
      },
      {
        "_id": "60ed76f694bf34007d34ca3d",
        "code": "MH",
        "name": "Marshall Islands"
      },
      {
        "_id": "60ed76f694bf34007d34ca3c",
        "code": "MM",
        "name": "Myanmar"
      },
      {
        "_id": "60ed76f694bf34007d34ca3b",
        "code": "MN",
        "name": "Mongolia"
      },
      {
        "_id": "60ed76f694bf34007d34ca3a",
        "code": "MO",
        "name": "Macao"
      },
      {
        "_id": "60ed76f694bf34007d34ca39",
        "code": "MP",
        "name": "Northern Mariana Islands"
      },
      {
        "_id": "60ed76f694bf34007d34ca38",
        "code": "MV",
        "name": "Maldives"
      },
      {
        "_id": "60ed76f694bf34007d34ca37",
        "code": "MY",
        "name": "Malaysia"
      },
      {
        "_id": "60ed76f694bf34007d34ca36",
        "code": "NF",
        "name": "Norfolk Island"
      },
      {
        "_id": "60ed76f694bf34007d34ca35",
        "code": "NP",
        "name": "Nepal"
      },
      {
        "_id": "60ed76f694bf34007d34ca34",
        "code": "NR",
        "name": "Nauru"
      },
      {
        "_id": "60ed76f694bf34007d34ca33",
        "code": "NU",
        "name": "Niue"
      },
      {
        "_id": "60ed76f694bf34007d34ca32",
        "code": "NZ",
        "name": "New Zealand"
      },
      {
        "_id": "60ed76f694bf34007d34ca31",
        "code": "PG",
        "name": "Papua New Guinea"
      },
      {
        "_id": "60ed76f694bf34007d34ca30",
        "code": "PH",
        "name": "Philippines"
      },
      {
        "_id": "60ed76f694bf34007d34ca2f",
        "code": "PK",
        "name": "Pakistan"
      },
      {
        "_id": "60ed76f694bf34007d34ca2e",
        "code": "PN",
        "name": "Pitcairn"
      },
      {
        "_id": "60ed76f694bf34007d34ca2d",
        "code": "PW",
        "name": "Palau"
      },
      {
        "_id": "60ed76f694bf34007d34ca2c",
        "code": "SB",
        "name": "Solomon Islands"
      },
      {
        "_id": "60ed76f694bf34007d34ca2b",
        "code": "SG",
        "name": "Singapore"
      },
      {
        "_id": "60ed76f694bf34007d34ca2a",
        "code": "TH",
        "name": "Thailand"
      },
      {
        "_id": "60ed76f694bf34007d34ca29",
        "code": "TK",
        "name": "Tokelau"
      },
      {
        "_id": "60ed76f694bf34007d34ca28",
        "code": "TL",
        "name": "Timor-Leste"
      },
      {
        "_id": "60ed76f694bf34007d34ca27",
        "code": "TO",
        "name": "Tonga"
      },
      {
        "_id": "60ed76f694bf34007d34ca26",
        "code": "TV",
        "name": "Tuvalu"
      },
      {
        "_id": "60ed76f694bf34007d34ca25",
        "code": "TW",
        "name": "Taiwan, Province of China"
      },
      {
        "_id": "60ed76f694bf34007d34ca24",
        "code": "UM",
        "name": "United States Minor Outlying Islands"
      },
      {
        "_id": "60ed76f694bf34007d34ca23",
        "code": "VN",
        "name": "Viet Nam"
      },
      {
        "_id": "60ed76f694bf34007d34ca22",
        "code": "VU",
        "name": "Vanuatu"
      },
      {
        "_id": "60ed76f694bf34007d34ca21",
        "code": "WS",
        "name": "Samoa"
      }
    ],
    "release": "2021-06-23T14:56:13.650Z",
    "seo": {
      "desc": "Set in the iconic Alien universe, Aliens: Fireteam Elite is a cooperative third-person survival shooter that drops your fireteam of hardened marines into a desperate fight to contain the evolving Xenomorph threat.",
      "title": null
    },
    "showReview": true,
    "slug": "aliens-fireteam-elite",
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2021-08-24T04:00:00.000Z",
      "id": 1549970,
      "type": "app"
    },
    "template_type": "standard",
    "type": "game",
    "url": "http://www.aliensfireteamelite.com",
    "video": [
      "o6FWR1sq51Q"
    ],
    "visible": {
      "valid_from": "2021-08-24T04:00:00.000Z",
      "valid_until": null
    },
    "desc": "<p><strong>ALIENS: FIRETEAM ELITE</strong></p>&#10;<p>Set in the iconic Alien universe, <strong>Aliens: Fireteam Elite</strong> is a cooperative third-person survival shooter that drops your fireteam of hardened marines into a desperate fight to contain the evolving Xenomorph threat. <br/><br/>Face off against waves of terrifying Xenomorph and Weyland-Yutani Synthetic foes alongside two players or AI teammates, as you and your fireteam desperately fight your way through four unique campaigns that introduce new storylines to the Alien universe. Create and customize your own Colonial Marine, choosing from an extensive variety of classes, weapons, gear and perks, battling overwhelming odds in this heart-pounding survival shooter experience.</p>&#10;<p><strong>THE ULTIMATE HUNT:</strong></p>&#10;<p>Play a pivotal role in the epic events that occur 23 years after the original Alien trilogy as a Colonial Marine stationed aboard the UAS Endeavor, battling terrifying Xenomorph threats. Stunning visuals, iconic enemies, realistic environments, powerful weapons, futuristic equipment, and an eerie soundscape, combined with new storylines in a series of replayable campaigns, expand upon the story from the blockbuster films.</p>&#10;<p><strong>SURVIVE THE HIVE:</strong></p>&#10;<p>Face overwhelming odds against over 20 enemy types, including 11 different Xenomorphs along the evolutionary scale from Facehuggers to Praetorians, each designed with their own intelligence to ambush, outsmart and eviscerate vulnerable marines. Utilize cover and master team strategy to survive extraterrestrial threats as they overrun your fireteam from every angle, swarm through doors and vents, scramble across walls and ceilings, and strike from darkness with uncanny ferocity.</p>&#10;<p><strong>CUSTOMIZE YOUR FIRETEAM:</strong></p>&#10;<p>Choose from five unique classes - Gunner, Demolisher, Technician, Doc and Recon - each with their own special abilities and character perks. Utilize an extensive arsenal of 30+ weapons and 70+ mods/attachments in your effort to eradicate the Alien threat. An innovative Perk Board modifies and improves your abilities, while a unique Challenge Card system alters the approach to each Campaign mission, offering a new experience with every playthrough.</p>",
    "supplier_id": "55db244ad3b050fe108b4665",
    "currentPrice": {
      "JPY": 414800,
      "RUB": 290445,
      "AUD": 4670,
      "CAD": 4249,
      "EUR": 3399,
      "USD": 3399,
      "GBP": 2974
    },
    "current_discount": {
      "percent": 0.15,
      "display_percentage": true,
      "until": "2021-09-22T15:59:00.000Z",
      "from": "2021-09-20T07:01:00.792Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": true,
      "highlighted": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "bundles": [],
        "cover": "a5e9eaf2-8248-40ce-9901-eebfa62f2dee.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "Aliens: Fireteam Elite",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 488000,
          "RUB": 341700,
          "AUD": 5495,
          "CAD": 4999,
          "EUR": 3999,
          "USD": 3999,
          "GBP": 3499
        },
        "slug": "aliens-fireteam-elite",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 414800,
          "RUB": 290445,
          "AUD": 4670,
          "CAD": 4249,
          "EUR": 3399,
          "USD": 3399,
          "GBP": 2974
        },
        "current_discount": {
          "percent": 0.15,
          "display_percentage": true,
          "until": "2021-09-22T15:59:00.000Z",
          "from": "2021-09-20T07:01:00.792Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Standard Edition"
      },
      {
        "bundles": [],
        "cover": "ae3e2c14-b195-4275-a916-61c126c00818.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "Aliens: Fireteam Elite Deluxe Edition",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 854000,
          "RUB": 599500,
          "AUD": 9595,
          "CAD": 8999,
          "EUR": 6999,
          "USD": 6999,
          "GBP": 5999
        },
        "slug": "aliens-fireteam-elite-deluxe-edition",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 725900,
          "RUB": 509575,
          "AUD": 8155,
          "CAD": 7649,
          "EUR": 5949,
          "USD": 5949,
          "GBP": 5099
        },
        "current_discount": {
          "percent": 0.15,
          "display_percentage": true,
          "until": "2021-09-22T15:59:00.000Z",
          "from": "2021-09-20T07:01:00.792Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Deluxe Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "edition_name": "Standard Edition",
    "recommendations": [
      "predator-hunting-grounds",
      "aliens-colonial-marines-collection",
      "xcom-2-collection",
      "predator-hunting-grounds-dutch-87-dlc-pack",
      "predator-hunting-grounds-predator-bundle-edition",
      "aliens-versus-predator-classic-2000",
      "xcom-2",
      "natural-selection-2",
      "warhammer-vermintide-2",
      "warhammer-vermintide-2-collectors-edition",
      "xcom-2-digital-deluxe-new",
      "alien-isolation-collection",
      "predator-hunting-grounds-dante-beast-mode-jefferson-dlc-pack",
      "alien-breed-2-assault",
      "killing-floor-2"
    ],
    "recommendations_challenger": [
      "aliens-fireteam-elite-deluxe-edition",
      "predator-hunting-grounds",
      "aliens-colonial-marines-collection",
      "xcom-2-collection",
      "predator-hunting-grounds-dutch-87-dlc-pack",
      "predator-hunting-grounds-predator-bundle-edition",
      "aliens-versus-predator-classic-2000",
      "xcom-2",
      "natural-selection-2",
      "warhammer-vermintide-2",
      "warhammer-vermintide-2-collectors-edition",
      "xcom-2-digital-deluxe-new",
      "alien-isolation-collection",
      "predator-hunting-grounds-dante-beast-mode-jefferson-dlc-pack",
      "alien-breed-2-assault"
    ],
    "videos": [
      {
        "id": "PsS6K0C_PYQ",
        "title": "Aliens: Fireteam Elite - M12A1 Rocket Launcher Modding Guide",
        "date": "2021-09-17T16:29:00Z",
        "thumbnail_url": "https://i.ytimg.com/vi/PsS6K0C_PYQ/hqdefault.jpg"
      },
      {
        "id": "7EHWmbq36TM",
        "title": "Aliens: Fireteam Elite - Twinhammer Modding Guide",
        "date": "2021-09-14T15:10:37Z",
        "thumbnail_url": "https://i.ytimg.com/vi/7EHWmbq36TM/hqdefault.jpg"
      },
      {
        "id": "02u95SDeMYA",
        "title": "Aliens: Fireteam Elite Funny Moments!",
        "date": "2021-09-13T20:00:00Z",
        "thumbnail_url": "https://i.ytimg.com/vi/02u95SDeMYA/hqdefault.jpg"
      },
      {
        "id": "wO0ym6FPoI8",
        "title": "Aliens: Fireteam Elite - EXPLOIT: Get The Challenge Cards You Need!",
        "date": "2021-09-12T16:25:13Z",
        "thumbnail_url": "https://i.ytimg.com/vi/wO0ym6FPoI8/hqdefault.jpg"
      },
      {
        "id": "ZFATOtntxbE",
        "title": "Aliens: Fireteam Elite is Excellent Co-Op",
        "date": "2021-09-14T18:33:07Z",
        "thumbnail_url": "https://i.ytimg.com/vi/ZFATOtntxbE/hqdefault.jpg"
      },
      {
        "id": "-gM-iXSSW9U",
        "title": "Aliens: Fireteam Elite - Game Over Man!!!",
        "date": "2021-09-08T03:45:34Z",
        "thumbnail_url": "https://i.ytimg.com/vi/-gM-iXSSW9U/hqdefault.jpg"
      },
      {
        "id": "27whhzcm4MI",
        "title": "Aliens Fireteam Elite",
        "date": "2021-09-03T22:02:52Z",
        "thumbnail_url": "https://i.ytimg.com/vi/27whhzcm4MI/hqdefault.jpg"
      },
      {
        "id": "JyaiwmbcCBU",
        "title": "Aliens Fireteam Elite // Into the Ruins (2-1 Intense) // Technician Gameplay",
        "date": "2021-09-10T21:38:56Z",
        "thumbnail_url": "https://i.ytimg.com/vi/JyaiwmbcCBU/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "YRD5gxEAACEAtMTB",
        "uid": "aliens-fireteam-elite-deluxe-edition-steam-pc-whats-included",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YRD5gxEAACEAtMTB%22%29+%5D%5D",
        "tags": [
          "Aliens",
          "What's Included",
          "Deluxe Edition",
          "Steam PC"
        ],
        "first_publication_date": "2021-08-09T10:17:35+0000",
        "last_publication_date": "2021-08-09T10:24:17+0000",
        "slugs": [
          "aliens-fireteam-elite-deluxe-edition---whats-included"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-08-09T10:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Aliens: Fireteam Elite Deluxe Edition - What's included",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/25d5e77e-0d93-4413-86b5-cd248ea6d490_aliensfireteam02.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/25d5e77e-0d93-4413-86b5-cd248ea6d490_aliensfireteam02.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/25d5e77e-0d93-4413-86b5-cd248ea6d490_aliensfireteam02.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/25d5e77e-0d93-4413-86b5-cd248ea6d490_aliensfireteam02.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Take it to the Xenomorphs in style with this bonus content",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "YP_HMxIAACYABhOY",
        "uid": "pc-games-releasing-in-august-2021",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YP_HMxIAACYABhOY%22%29+%5D%5D",
        "tags": [
          "August",
          "Steam PC",
          "New releases"
        ],
        "first_publication_date": "2021-07-29T23:00:02+0000",
        "last_publication_date": "2021-07-29T23:00:02+0000",
        "slugs": [
          "pc-games-releasing-in-august-2021",
          "pc-games-releasing-in-july-2021"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-07-29T23:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "PC games releasing in August 2021",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/6d3a0828-cd0d-420c-9fe0-14f028d20cae_kingsbounty2.jpeg?auto=compress,format&rect=0,0,1919,1079&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/6d3a0828-cd0d-420c-9fe0-14f028d20cae_kingsbounty2.jpeg?auto=compress,format&rect=0,0,1919,1079&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/6d3a0828-cd0d-420c-9fe0-14f028d20cae_kingsbounty2.jpeg?auto=compress,format&rect=0,0,1919,1079&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/6d3a0828-cd0d-420c-9fe0-14f028d20cae_kingsbounty2.jpeg?auto=compress,format&rect=0,0,1919,1079&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Your next favorite game may be releasing this month",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": [
        {
          "_id": "612e2d88e5364e1c83ec6edf",
          "slug": "aliens-fireteam-elite",
          "rating": 4,
          "display_name": "Jonboy",
          "title": "They mostly come out at night, mostly",
          "text": "The last time we saw the colonial marines in a game it was underwhelming and I was not expecting a huge amount from this, but have been pleasantly surprised with how it has turned out. The core gameplay loop is rewarding and the challenge cards give a nice twist for subsequent play-throughs. The atmosphere and sound design is really engaging and its great to fire off your pulse rifle in the tight corridors. If you have friends to play with, are a fan of team shooters like Left 4 dead, or you are an Aliens fan this is a must buy/play",
          "date": "2021-08-31T13:37:15.941Z",
          "staff_review": true,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "6123d0a388842a007dc4e7ef",
          "version_id": "612e308bec4265009da2959e",
          "published": true,
          "has_active_version": true,
          "removed": false
        },
        {
          "_id": "612fa121e5364e1c833a4e82",
          "slug": "aliens-fireteam-elite",
          "rating": 5,
          "display_name": "SlothsHere",
          "title": "Amazing game",
          "text": "This game is truly incredible. I highly, highly recommend it. The full price is worth it. You'll get about 8 hours for the full playthrough once & then the game kicks into gear with its replayability values at higher difficulties, endless horde modes & more. \n\nIt's a really, really enjoyable game and has a lot of potential with \"apparently\" 4 DLC's to come in the future!",
          "date": "2021-09-01T15:51:09.299Z",
          "staff_review": false,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "6123d0a388842a007dc4e7ef",
          "version_id": "612fa16dc67a6e00837cbae6",
          "published": true,
          "has_active_version": true,
          "removed": false
        }
      ]
    },
    "userReviewSummary": {
      "rating_score": 4.5,
      "total_ratings": 2,
      "percent_recommended": 100,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 0,
        "four_star_percentage": 50,
        "five_star_percentage": 50
      },
      "reviewLocales": [
        "en"
      ],
      "total_written_reviews": 2
    }
  },
  {
    "_id": "61123f0db631d300763881be",
    "__v": 2,
    "age": {
      "ACB": 15,
      "USK": 12,
      "PEGI": 16,
      "ESRB": 13
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_until": null,
      "valid_from": "2021-08-13T14:00:00.000Z"
    },
    "bundles": [],
    "collections": [],
    "cover": "13e3d3dc-92ea-44f9-982e-40c9d9a9d120.jpeg",
    "developers": [
      "CREATIVE ASSEMBLY"
    ],
    "display_type": "game",
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "features": [
      "Steam Achievements"
    ],
    "franchises": [
      "Total War"
    ],
    "free_redeem_code": null,
    "genres": [
      "Action",
      "Simulation",
      "Strategy"
    ],
    "img": [
      {
        "order": "99",
        "slug": "d6475c14-503c-43d3-9d52-e85e31a6a8ad.png",
        "alt": "01_TWS_TROY_Hero.png"
      },
      {
        "order": "99",
        "slug": "bb9ee6be-cdd0-4b68-9887-6006b2c002ea.png",
        "alt": "02_TWS_TROY_Campaign_TroyCity.png"
      },
      {
        "order": "99",
        "slug": "c3294a20-93ea-498c-8983-5d0c5a19771d.png",
        "alt": "03_TWS_TROY_Campaign_MountOlympus.png"
      },
      {
        "order": "99",
        "slug": "5946c7c5-f3a8-44c3-aff6-2869ad598a50.png",
        "alt": "04_TWS_TROY_LargeBattle.png"
      },
      {
        "slug": "321f2654-5e98-4736-8998-8a819e24f184.png",
        "alt": "05_TWS_TROY_Minotaur.png"
      }
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish - Spain",
      "Czech",
      "Korean",
      "Polish",
      "Portuguese - Brazil",
      "Russian",
      "Simplified Chinese",
      "Traditional Chinese",
      "Turkish"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer"
    ],
    "name": "A Total War Saga: TROY - Heroic Edition",
    "notice": {
      "legal": "© SEGA. All Rights Reserved. Creative Assembly, the Creative Assembly logo, A Total War Saga: TROY, Total War, and the Total War logo are either trademarks or registered trademarks of The Creative Assembly Limited. SEGA and the SEGA logo are either registered trademarks or trademarks of SEGA Holdings Co., Limited or its affiliates. SEGA is registered in the U.S Patent and Trademark Office. All other trademarks, logos and copyrights are property of their respective owners."
    },
    "platform_specs": {
      "mac": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> macOS 10.15.6<br></li><li><strong>Processor:</strong> 3.6GHz Intel Core i3 / 2GHz Intel Core i5 or better<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> 2GB AMD Radeon R9 M290 or better, 1.5GB Intel Iris 540 or better<br></li><li><strong>Storage:</strong> 40 GB available space<br></li><li><strong>Additional Notes:</strong> The game is supported on the following Macs. To check your Mac model and when it was released, select About This Mac from the Apple menu on your menu bar.  <ul class=\"bb_ul\"> <li>* All 13&quot; MacBook Airs released since 2020 with an Intel Core i5 processor or better  </li><li>* All 13&quot; MacBook Pros released since 2016  </li><li>* All 15&quot; MacBook Pros released since 2016  </li><li>* All 16&quot; MacBook Pros released since 2019  </li><li>* All 21.5&quot; iMacs released since 2017  </li><li>* All 27&quot; iMacs released since Late 2014  </li><li>* All 27&quot; iMac Pros released since Late 2017  </li><li>* All Mac Pros released since Late 2013  </li></ul>  <strong>Please note for your computer to meet the minimum requirements it must match or better all elements of the listed system requirements. For more detailed specifications check the Feral website.</strong></li></ul>"
      },
      "win": {
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows 7/8.1/10 64 Bit<br></li><li><strong>Processor:</strong> Intel i5-6600 / Ryzen 5 2600X<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> Nvidia GTX 970 / AMD Radeon R9 270X 2 GB<br></li><li><strong>DirectX:</strong> Version 11<br></li><li><strong>Storage:</strong> 26 GB available space</li></ul>",
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows 7/8.1/10 64 Bit<br></li><li><strong>Processor:</strong> Intel Core 2 Duo 3.0 GHz/Intel i7 8550U 1.80GHz<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> Nvidia GTX 460 1GB/AMD Radeon HD 5770 1 GB/Intel UHD Graphics 620<br></li><li><strong>DirectX:</strong> Version 11<br></li><li><strong>Storage:</strong> 26 GB available space</li></ul>"
      }
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 1153700,
      "RUB": 824300,
      "AUD": 14296,
      "CAD": 12346,
      "EUR": 9496,
      "USD": 9496,
      "GBP": 7096
    },
    "publishers": [
      "SEGA"
    ],
    "quotes": [],
    "regions_excluded": [],
    "regions_included": [
      {
        "_id": "61123f20e24677007d936e8b",
        "code": "AL",
        "name": "Albania"
      },
      {
        "_id": "61123f20e24677007d936e8a",
        "code": "AD",
        "name": "Andorra"
      },
      {
        "_id": "61123f20e24677007d936e89",
        "code": "AT",
        "name": "Austria"
      },
      {
        "_id": "61123f20e24677007d936e88",
        "code": "BE",
        "name": "Belgium"
      },
      {
        "_id": "61123f20e24677007d936e87",
        "code": "BA",
        "name": "Bosnia and Herzegovina"
      },
      {
        "_id": "61123f20e24677007d936e86",
        "code": "BG",
        "name": "Bulgaria"
      },
      {
        "_id": "61123f20e24677007d936e85",
        "code": "HR",
        "name": "Croatia"
      },
      {
        "_id": "61123f20e24677007d936e84",
        "code": "CY",
        "name": "Cyprus"
      },
      {
        "_id": "61123f20e24677007d936e83",
        "code": "CZ",
        "name": "Czech Republic"
      },
      {
        "_id": "61123f20e24677007d936e82",
        "code": "DK",
        "name": "Denmark"
      },
      {
        "_id": "61123f20e24677007d936e81",
        "code": "EE",
        "name": "Estonia"
      },
      {
        "_id": "61123f20e24677007d936e80",
        "code": "FK",
        "name": "Falkland Islands (Malvinas)"
      },
      {
        "_id": "61123f20e24677007d936e7f",
        "code": "FO",
        "name": "Faroe Islands"
      },
      {
        "_id": "61123f20e24677007d936e7e",
        "code": "FI",
        "name": "Finland"
      },
      {
        "_id": "61123f20e24677007d936e7d",
        "code": "FR",
        "name": "France"
      },
      {
        "_id": "61123f20e24677007d936e7c",
        "code": "GF",
        "name": "French Guiana"
      },
      {
        "_id": "61123f20e24677007d936e7b",
        "code": "PF",
        "name": "French Polynesia"
      },
      {
        "_id": "61123f20e24677007d936e7a",
        "code": "DE",
        "name": "Germany"
      },
      {
        "_id": "61123f20e24677007d936e79",
        "code": "GI",
        "name": "Gibraltar"
      },
      {
        "_id": "61123f20e24677007d936e78",
        "code": "GR",
        "name": "Greece"
      },
      {
        "_id": "61123f20e24677007d936e77",
        "code": "GL",
        "name": "Greenland"
      },
      {
        "_id": "61123f20e24677007d936e76",
        "code": "GP",
        "name": "Guadeloupe"
      },
      {
        "_id": "61123f20e24677007d936e75",
        "code": "GG",
        "name": "Guernsey"
      },
      {
        "_id": "61123f20e24677007d936e74",
        "code": "VA",
        "name": "Holy See (Vatican City State)"
      },
      {
        "_id": "61123f20e24677007d936e73",
        "code": "HU",
        "name": "Hungary"
      },
      {
        "_id": "61123f20e24677007d936e72",
        "code": "IS",
        "name": "Iceland"
      },
      {
        "_id": "61123f20e24677007d936e71",
        "code": "IE",
        "name": "Ireland"
      },
      {
        "_id": "61123f20e24677007d936e70",
        "code": "IM",
        "name": "Isle of Man"
      },
      {
        "_id": "61123f20e24677007d936e6f",
        "code": "IT",
        "name": "Italy"
      },
      {
        "_id": "61123f20e24677007d936e6e",
        "code": "JE",
        "name": "Jersey"
      },
      {
        "_id": "61123f20e24677007d936e6d",
        "code": "LV",
        "name": "Latvia"
      },
      {
        "_id": "61123f20e24677007d936e6c",
        "code": "LI",
        "name": "Liechtenstein"
      },
      {
        "_id": "61123f20e24677007d936e6b",
        "code": "LT",
        "name": "Lithuania"
      },
      {
        "_id": "61123f20e24677007d936e6a",
        "code": "LU",
        "name": "Luxembourg"
      },
      {
        "_id": "61123f20e24677007d936e69",
        "code": "MK",
        "name": "Macedonia, the Former Yugoslav Republic of"
      },
      {
        "_id": "61123f20e24677007d936e68",
        "code": "MT",
        "name": "Malta"
      },
      {
        "_id": "61123f20e24677007d936e67",
        "code": "MQ",
        "name": "Martinique"
      },
      {
        "_id": "61123f20e24677007d936e66",
        "code": "YT",
        "name": "Mayotte"
      },
      {
        "_id": "61123f20e24677007d936e65",
        "code": "MC",
        "name": "Monaco"
      },
      {
        "_id": "61123f20e24677007d936e64",
        "code": "ME",
        "name": "Montenegro"
      },
      {
        "_id": "61123f20e24677007d936e63",
        "code": "NL",
        "name": "Netherlands"
      },
      {
        "_id": "61123f20e24677007d936e62",
        "code": "NC",
        "name": "New Caledonia"
      },
      {
        "_id": "61123f20e24677007d936e61",
        "code": "NO",
        "name": "Norway"
      },
      {
        "_id": "61123f20e24677007d936e60",
        "code": "PL",
        "name": "Poland"
      },
      {
        "_id": "61123f20e24677007d936e5f",
        "code": "PT",
        "name": "Portugal"
      },
      {
        "_id": "61123f20e24677007d936e5e",
        "code": "RO",
        "name": "Romania"
      },
      {
        "_id": "61123f20e24677007d936e5d",
        "code": "MF",
        "name": "Saint Martin (French part)"
      },
      {
        "_id": "61123f20e24677007d936e5c",
        "code": "SM",
        "name": "San Marino"
      },
      {
        "_id": "61123f20e24677007d936e5b",
        "code": "RS",
        "name": "Serbia"
      },
      {
        "_id": "61123f20e24677007d936e5a",
        "code": "SK",
        "name": "Slovakia"
      },
      {
        "_id": "61123f20e24677007d936e59",
        "code": "SI",
        "name": "Slovenia"
      },
      {
        "_id": "61123f20e24677007d936e58",
        "code": "ES",
        "name": "Spain"
      },
      {
        "_id": "61123f20e24677007d936e57",
        "code": "SE",
        "name": "Sweden"
      },
      {
        "_id": "61123f20e24677007d936e56",
        "code": "CH",
        "name": "Switzerland"
      },
      {
        "_id": "61123f20e24677007d936e55",
        "code": "GB",
        "name": "United Kingdom"
      }
    ],
    "release": "2021-08-10T08:45:16.953Z",
    "seo": {
      "desc": "Experience spectacular real-time battles to the heart of the Trojan War with your A Total War Saga: TROY - Heroic Edition Steam PC key. Includes base game, Mythos DLC, Amazons DLC, and Ajax & Diomedes DLC!",
      "title": null
    },
    "showReview": true,
    "slug": "a-total-war-saga-troy-heroic-edition",
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "steam": {
      "packages": [],
      "dlc": [
        1486710,
        1553061,
        1188790,
        1353190
      ],
      "release": "2021-09-02T14:00:00.000Z",
      "id": 1099410,
      "type": "app"
    },
    "type": "game",
    "url": "https://www.totalwar.com",
    "video": [
      "4ZR3DGFwehw",
      "OaSkIVpp_mI"
    ],
    "visible": {
      "valid_until": null,
      "valid_from": "2021-08-13T14:00:00.000Z"
    },
    "downloads": [],
    "template_type": "standard",
    "desc": "<p>Experience&#160;spectacular real-time battles to the heart of the Trojan War with your&#160;A Total War Saga: TROY - Heroic Edition Steam PC key. In the latest installment of the award-winning strategy game series, you'll enjoy&#160;grand, turn-based empire management and conflicts across a historical map inspired by The Iliad.</p>&#10;<p>Feel the full breadth of war as the Heroic Edition includes the base game plus the Mythos DLC, Amazons DLC, and Ajax &amp; Diomedes DLC!</p>&#10;<p><strong>BRING TROY TO LIFE<br/></strong>In this legendary age, heroes walk the earth. In an act that shocks the world, audacious Paris, prince of Troy, elopes with the beautiful queen of Sparta. As they sail away, King Menelaus curses her name. He vows to bring his wife home &#8211; whatever the cost.&#160;</p>&#10;<p><strong>BECOME A LEGEND<br/></strong>Fight to save or conquer the kingdom of Troy as one of eight iconic Heroes, including the infamous warrior Achilles, noble protector Hector, wayward prince Paris and vengeful King Menelaus.</p>&#10;<p>Each Hero is equipped with special abilities, weapons, units, and strategic positions on the map.&#160;</p>&#10;<p><strong>TURN THE TIDE OF WAR&#160;<br/></strong>Lead an army across the fabled lands of the Aegean, recruit special units inspired by creatures of Greek myth, and charge into battle against ferocious foes.&#160;</p>&#10;<p><strong>BUILD A BRONZE AGE EMPIRE<br/></strong>Build your empire through strategy, statecraft, diplomacy, and all-out war as you conquer this vast and striking recreation of the Bronze Age Mediterranean.</p>&#10;<p><strong>YOUR OFFICIAL A TOTAL WAR SAGA: TROY - HEROIC EDITION STEAM PC KEY INCLUDES:</strong></p>&#10;<ul>&#10;<li>Base game plus&#160;Mythos DLC,&#160;Amazons DLC, and&#160;Ajax &amp; Diomedes DLC.</li>&#10;<li>Next installment in the award-winning action-strategy franchise.</li>&#10;<li>Special mythical units to uncover, defeat and recruit for your armies.</li>&#10;<li>Stunning map recreation of the Bronze Age Mediterranean to explore.</li>&#10;<li>Eight legendary Heroes to choose from including&#160;Achilles, Hector, and&#160;King Menelaus.</li>&#10;</ul>",
    "hitcardVideo": "m9qKOWPmVVCyq8Y2yPoRUKy5XWJBNYH3D-480p.mp4",
    "genba_id": "88979be7-f83f-4c88-ae3d-32f56a4f18b8",
    "parent_slug": "a-total-war-saga-troy",
    "supplier_id": "57874ac557564d0e00eade39",
    "currentPrice": {
      "JPY": 565313,
      "RUB": 403907,
      "AUD": 7005,
      "CAD": 6049,
      "EUR": 4653,
      "USD": 4653,
      "GBP": 3477
    },
    "current_discount": {
      "percent": 0.51,
      "display_percentage": true,
      "until": "2021-09-30T14:00:00.000Z",
      "from": "2021-09-03T15:01:00.000Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": false,
      "highlighted": true
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "bundles": [],
        "cover": "503d09c7-2652-4448-a5d2-ca8aecefd105.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "A Total War Saga: TROY",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 607600,
          "RUB": 434300,
          "AUD": 7499,
          "CAD": 6499,
          "EUR": 4999,
          "USD": 4999,
          "GBP": 3499
        },
        "slug": "a-total-war-saga-troy",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 376712,
          "RUB": 269266,
          "AUD": 4649,
          "CAD": 4029,
          "EUR": 3099,
          "USD": 3099,
          "GBP": 2169
        },
        "current_discount": {
          "percent": 0.38,
          "display_percentage": true,
          "until": "2021-09-30T14:00:00.000Z",
          "from": "2021-09-03T15:01:00.000Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": false,
          "highlighted": true
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Standard Edition"
      },
      {
        "bundles": [],
        "cover": "47b9045d-752b-47c6-9d29-4fd7fc447f2a.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "A Total War Saga: TROY - Mythic Edition",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 911000,
          "RUB": 650800,
          "AUD": 11298,
          "CAD": 9749,
          "EUR": 7498,
          "USD": 7498,
          "GBP": 5498
        },
        "slug": "a-total-war-saga-troy-mythic-edition",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 528380,
          "RUB": 377464,
          "AUD": 6552,
          "CAD": 5654,
          "EUR": 4348,
          "USD": 4348,
          "GBP": 3188
        },
        "current_discount": {
          "percent": 0.42,
          "display_percentage": true,
          "until": "2021-09-30T14:00:00.000Z",
          "from": "2021-09-03T15:01:00.000Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": false,
          "highlighted": true
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Mythic Edition"
      },
      {
        "bundles": [],
        "cover": "13e3d3dc-92ea-44f9-982e-40c9d9a9d120.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "A Total War Saga: TROY - Heroic Edition",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 1153700,
          "RUB": 824300,
          "AUD": 14296,
          "CAD": 12346,
          "EUR": 9496,
          "USD": 9496,
          "GBP": 7096
        },
        "slug": "a-total-war-saga-troy-heroic-edition",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 565313,
          "RUB": 403907,
          "AUD": 7005,
          "CAD": 6049,
          "EUR": 4653,
          "USD": 4653,
          "GBP": 3477
        },
        "current_discount": {
          "percent": 0.51,
          "display_percentage": true,
          "until": "2021-09-30T14:00:00.000Z",
          "from": "2021-09-03T15:01:00.000Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": false,
          "highlighted": true
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Heroic Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [
      "a-total-war-saga-troy-amazons",
      "a-total-war-saga-troy-ajax-and-diomedes",
      "a-total-war-saga-troy-mythos"
    ],
    "edition_name": "Heroic Edition",
    "recommendations": [
      "total-war-three-kingdoms",
      "total-war-rome-ii-emperor-edition",
      "total-war-warhammer-ii",
      "total-war-warhammer",
      "a-total-war-saga-troy-ajax-and-diomedes",
      "total-war-shogun-2",
      "total-war-rome-remastered",
      "a-total-war-saga-troy-mythos",
      "total-war-empire-definitive-edition",
      "total-war-medieval-ii-definitive-edition",
      "endless-legend",
      "men-of-war-vietnam-special",
      "sid-meiers-civilization-v-complete-edition",
      "hearts-of-iron-iv-cadet-edition",
      "total-war-warhammer-iii"
    ],
    "recommendations_challenger": [
      "a-total-war-saga-troy",
      "a-total-war-saga-troy-mythic-edition",
      "total-war-three-kingdoms",
      "total-war-rome-ii-emperor-edition",
      "total-war-warhammer-ii",
      "total-war-warhammer",
      "a-total-war-saga-troy-ajax-and-diomedes",
      "total-war-shogun-2",
      "total-war-rome-remastered",
      "a-total-war-saga-troy-mythos",
      "total-war-empire-definitive-edition",
      "total-war-medieval-ii-definitive-edition",
      "endless-legend",
      "men-of-war-vietnam-special",
      "sid-meiers-civilization-v-complete-edition"
    ],
    "videos": [
      {
        "id": "u-RqQisStpY",
        "title": "Melee Epic Heroes Tournament. Total War Saga: Troy",
        "date": "2020-08-18T12:49:54Z",
        "thumbnail_url": "https://i.ytimg.com/vi/u-RqQisStpY/hqdefault.jpg"
      },
      {
        "id": "6_b0ugBynHw",
        "title": "A Total War Saga TROY",
        "date": "2020-08-15T06:21:42Z",
        "thumbnail_url": "https://i.ytimg.com/vi/6_b0ugBynHw/hqdefault.jpg"
      },
      {
        "id": "MiIogmc70S8",
        "title": "Let&#39;s try Total War Saga: Troy",
        "date": "2021-09-03T18:01:58Z",
        "thumbnail_url": "https://i.ytimg.com/vi/MiIogmc70S8/hqdefault.jpg"
      },
      {
        "id": "qN8cs7cZz0o",
        "title": "Total War: TROY Extended version  / Official Trailer / A Total War Saga + TROY - Campaign Map Reveal",
        "date": "2020-06-06T23:14:55Z",
        "thumbnail_url": "https://i.ytimg.com/vi/qN8cs7cZz0o/hqdefault.jpg"
      },
      {
        "id": "-xL25rDW56M",
        "title": "Total War: Troy - (Achilles Campaign) (Achilles Hero God Power)",
        "date": "2020-10-05T17:45:24Z",
        "thumbnail_url": "https://i.ytimg.com/vi/-xL25rDW56M/hqdefault.jpg"
      },
      {
        "id": "YY1Zgf-tDK8",
        "title": "Troy  A Total War Saga Heroic Victory",
        "date": "2021-09-03T22:18:12Z",
        "thumbnail_url": "https://i.ytimg.com/vi/YY1Zgf-tDK8/hqdefault.jpg"
      },
      {
        "id": "9t47lXEjpuo",
        "title": "OUR FIRST REAL BATTLE! | A Total War Saga: TROY - Menelaus Campaign - Episode 2 (Mythos DLC)",
        "date": "2021-09-13T16:00:05Z",
        "thumbnail_url": "https://i.ytimg.com/vi/9t47lXEjpuo/hqdefault.jpg"
      },
      {
        "id": "JnT4CXA1rsA",
        "title": "A Total War Saga: Troy Ajax Hero",
        "date": "2021-02-01T11:57:41Z",
        "thumbnail_url": "https://i.ytimg.com/vi/JnT4CXA1rsA/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "YTDGmhEAAB7M_CSM",
        "uid": "total-war-saga-troy-heroic-edition-whats-included-steam-pc",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YTDGmhEAAB7M_CSM%22%29+%5D%5D",
        "tags": [
          "Heroic Edition",
          "What's Included",
          "Steam PC"
        ],
        "first_publication_date": "2021-09-02T13:00:28+0000",
        "last_publication_date": "2021-09-02T13:00:28+0000",
        "slugs": [
          "a-total-war-saga-troy-heroic-edition---whats-included"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-09-02T13:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "A Total War Saga: TROY Heroic Edition - What's included",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/549fe4d2-db49-4b78-bc22-3018b9f2a221_atwstroy.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/549fe4d2-db49-4b78-bc22-3018b9f2a221_atwstroy.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/549fe4d2-db49-4b78-bc22-3018b9f2a221_atwstroy.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/549fe4d2-db49-4b78-bc22-3018b9f2a221_atwstroy.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Feel the full breadth of war in this jam-packed edition",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "YSSqzREAACEAyxpb",
        "uid": "pc-games-releasing-in-september-2021",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YSSqzREAACEAyxpb%22%29+%5D%5D",
        "tags": [
          "Steam PC",
          "New releases",
          "September"
        ],
        "first_publication_date": "2021-08-26T15:00:00+0000",
        "last_publication_date": "2021-08-27T13:02:37+0000",
        "slugs": [
          "pc-games-releasing-in-september-2021",
          "pc-games-releasing-in-august-2021"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-08-26T15:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "PC games releasing in September 2021",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/a3562010-5c80-450b-be54-b99e08d9316e_e8b39c56-fb3c-4dc0-bfbd-9ebb668e5071.jpeg?auto=compress,format&rect=0,0,3840,2160&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/a3562010-5c80-450b-be54-b99e08d9316e_e8b39c56-fb3c-4dc0-bfbd-9ebb668e5071.jpeg?auto=compress,format&rect=0,0,3840,2160&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/a3562010-5c80-450b-be54-b99e08d9316e_e8b39c56-fb3c-4dc0-bfbd-9ebb668e5071.jpeg?auto=compress,format&rect=0,0,3840,2160&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/a3562010-5c80-450b-be54-b99e08d9316e_e8b39c56-fb3c-4dc0-bfbd-9ebb668e5071.jpeg?auto=compress,format&rect=0,0,3840,2160&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "It may be Fall, but the game releases aren't dropping off",
              "spans": []
            }
          ]
        }
      }
    ],
    "relatedHits": [
      {
        "product_id": "612f81224bcb7a00764d67c6",
        "sku": "PCD20961EU",
        "name": "A Total War Saga: TROY - Mythos",
        "slug": "a-total-war-saga-troy-mythos",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "96d028eb-579c-45e8-9afd-21f369f07977.jpeg",
        "tiered": false,
        "discount_percent": 18,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 16.39,
          "EUR": 20.49,
          "USD": 20.49,
          "CAD": 26.64,
          "AUD": 31.15,
          "RUB": 1765.46,
          "JPY": 2480.5
        },
        "fullPrice": {
          "GBP": 19.99,
          "EUR": 24.99,
          "USD": 24.99,
          "CAD": 32.49,
          "AUD": 37.99,
          "RUB": 2153,
          "JPY": 3025
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "kx4-WOUBoCs"
        ],
        "available_valid_from": 1632034860,
        "available_valid_until": 1632239940,
        "release_date": 1630591200,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "673f6dad-de03-4c8a-8153-e1d73a0a0d0a.jpeg",
          "99fd317a-547f-4404-80c7-567a0fa0807d.jpeg",
          "62a9b53f-e837-436e-9510-f82e0286ca4a.jpeg",
          "6a3f0130-a9ab-4ca2-8169-7bc25ca76b16.jpeg",
          "9111a26d-9043-4cc1-bef2-2b0c5dd30f8d.jpeg",
          "876fa2e3-3cff-4b85-ae59-8d013e102955.jpeg"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "zJNOJrZkkxHYonKrNJG5UKwpRPVzk-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "zJNOJrZkkxHYonKrNJG5UKwpRPVzk-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "zJNOJrZkkxHYonKrNJG5UKwpRPVzk-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "zJNOJrZkkxHYonKrNJG5UKwpRPVzk-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "zJNOJrZkkxHYonKrNJG5UKwpRPVzk-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "zJNOJrZkkxHYonKrNJG5UKwpRPVzk-240p.webm"
          }
        ],
        "video_clip_poster": "zJNOJrZkkxHYonKrNJG5UKwpRPVzk-poster.jpg",
        "age_ratings": {
          "ESRB": 13,
          "PEGI": 16,
          "USK": 12,
          "ACB": 15
        },
        "objectID": "5360821002"
      },
      {
        "product_id": "612f7571d45c4a007dd6a06e",
        "sku": "PCD20965EU",
        "name": "A Total War Saga: TROY - Ajax & Diomedes",
        "slug": "a-total-war-saga-troy-ajax-and-diomedes",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "5014b2d7-178c-402b-955c-057f48752a5f.jpeg",
        "tiered": false,
        "discount_percent": 18,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 6.55,
          "EUR": 8.19,
          "USD": 8.19,
          "CAD": 10.65,
          "AUD": 12.29,
          "RUB": 706.02,
          "JPY": 993.84
        },
        "fullPrice": {
          "GBP": 7.99,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 12.99,
          "AUD": 14.99,
          "RUB": 861,
          "JPY": 1212
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "HtLo8fhiUuI"
        ],
        "available_valid_from": 1632034860,
        "available_valid_until": 1632239940,
        "release_date": 1630591200,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "0610584e-f645-42f0-b914-9dfe59c7c50a.jpeg",
          "2ed4c649-2bd9-48a6-895c-29389d08ccd9.jpeg",
          "77590a45-5595-47a6-86d9-383cacce9055.jpeg",
          "88803636-3888-4418-9030-49d1d44cdc3f.jpeg",
          "4c2bea67-5e2a-4c8e-b6f5-d4a98ff4073b.jpeg",
          "2a1088f5-273b-4c0a-9332-efeef42e5276.jpeg"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "7qR1vvpoMDI4yVLPALPGUNqw7Z5Z2-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "7qR1vvpoMDI4yVLPALPGUNqw7Z5Z2-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "7qR1vvpoMDI4yVLPALPGUNqw7Z5Z2-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "7qR1vvpoMDI4yVLPALPGUNqw7Z5Z2-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "7qR1vvpoMDI4yVLPALPGUNqw7Z5Z2-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "7qR1vvpoMDI4yVLPALPGUNqw7Z5Z2-240p.webm"
          }
        ],
        "video_clip_poster": "7qR1vvpoMDI4yVLPALPGUNqw7Z5Z2-poster.jpg",
        "age_ratings": {
          "ESRB": 13,
          "PEGI": 16,
          "USK": 12,
          "ACB": 15
        },
        "objectID": "5360815002"
      },
      {
        "product_id": "612f5182d1d10f007db87582",
        "sku": "PCD20956EU",
        "name": "A Total War Saga: TROY - Amazons",
        "slug": "a-total-war-saga-troy-amazons",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "62b68a7e-7f17-4c3d-8d7b-82ccc1145a98.jpeg",
        "tiered": false,
        "discount_percent": 18,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 6.55,
          "EUR": 8.19,
          "USD": 8.19,
          "CAD": 10.65,
          "AUD": 12.29,
          "RUB": 706.84,
          "JPY": 993.84
        },
        "fullPrice": {
          "GBP": 7.99,
          "EUR": 9.99,
          "USD": 9.99,
          "CAD": 12.99,
          "AUD": 14.99,
          "RUB": 862,
          "JPY": 1212
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Multiplayer",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "4ZR3DGFwehw"
        ],
        "available_valid_from": 1632034860,
        "available_valid_until": 1632239940,
        "release_date": 1630591200,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "ce2e4b58-35f7-4e1f-9601-fee44e5c0e15.jpeg",
          "1454be23-e68d-4175-94d9-d1242dbfc71a.jpeg",
          "ab5e204e-ee5f-4494-9f22-64fd30510290.jpeg",
          "61052fd8-1f2f-4d84-bb9e-2dbdb4e4ce92.jpeg",
          "cac2903b-d999-4600-b963-0670e0facddc.jpeg"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "7B9o1qkm77tGY26qGVXWUN0VgqWx0-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "7B9o1qkm77tGY26qGVXWUN0VgqWx0-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "7B9o1qkm77tGY26qGVXWUN0VgqWx0-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "7B9o1qkm77tGY26qGVXWUN0VgqWx0-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "7B9o1qkm77tGY26qGVXWUN0VgqWx0-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "7B9o1qkm77tGY26qGVXWUN0VgqWx0-240p.webm"
          }
        ],
        "video_clip_poster": "7B9o1qkm77tGY26qGVXWUN0VgqWx0-poster.jpg",
        "age_ratings": {
          "ESRB": 13,
          "PEGI": 16,
          "USK": 12,
          "ACB": 15
        },
        "objectID": "5360797002"
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {},
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "IGN",
        "message": "\"A Total War Saga: Troy absolutely nails its Bronze Age setting and comes up with interesting ways to make the period work in its grand strategy framework, but its AI has trouble wrapping its head around it.\"",
        "url": "http://www.ign.com/articles/a-total-war-saga-troy-review",
        "displayScore": "8 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/ign.jpg",
        "author": "T.J. Hafer"
      },
      {
        "scoreType": "text",
        "outletName": "PC Gamer",
        "message": "\"Refreshing tactical changes and some of the best maps in the series make this an experiment worth checking out.\"",
        "url": "https://www.pcgamer.com/a-total-war-saga-troy-review/",
        "displayScore": "75 / 100",
        "outletImage": "https://cdn.fanatical.com/production/logos/pcgamer.jpg",
        "author": "Fraser Brown"
      },
      {
        "scoreType": "text",
        "outletName": "God is a Geek",
        "message": "\"A Total War Saga: Troy is a slightly different Total War game. It's commitment to the period, and all that entails is a lot of fun and well worth a look.\"",
        "url": "https://www.godisageek.com/reviews/a-total-war-saga-troy-review/",
        "displayScore": "8 / 10",
        "outletImage": "",
        "author": "Chris Hyde"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/9586/a-total-war-saga-troy",
    "opencriticScoreString": "76% Strong",
    "opencriticReviewCount": 42,
    "opencriticPercentRecommended": 68,
    "openCriticScore": 76
  },
  {
    "_id": "59148d10789c68307354f860",
    "release": "2017-05-11T16:10:56.088Z",
    "quotes": [
      {
        "_id": "598ad0fbb433a30f0037ed62",
        "author": "Polygon",
        "message": "“Dead Cells may be the most fun I've had in a game all year.”"
      },
      {
        "_id": "598ad0fbb433a30f0037ed61",
        "author": "Destructoid",
        "message": "\"It's already one of my favorite games this year.\""
      },
      {
        "_id": "598ad0fbb433a30f0037ed60",
        "author": "Waypoint",
        "message": "\"In short: Dead Cells is very, very good.\""
      }
    ],
    "seo": {
      "desc": "Kill. Die. Learn. Repeat. The illegitimate child of the roguelike and metroidvania, get an official Steam key for Early Access hit Dead Cells.",
      "title": "Dead Cells"
    },
    "notice": {
      "legal": null
    },
    "age": {
      "ESRB": 0,
      "PEGI": 0,
      "USK": 0,
      "ACB": 0
    },
    "drm": {
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 248000,
      "RUB": 159900,
      "AUD": 3595,
      "CAD": 2999,
      "EUR": 2499,
      "USD": 2499,
      "GBP": 2199
    },
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2017-05-10T00:00:00.000Z",
      "id": 588650,
      "type": "app"
    },
    "lang": [
      "English",
      "French",
      "Simplified Chinese"
    ],
    "genres": [
      "Action",
      "Indie"
    ],
    "publishers": [
      "Motion Twin",
      "Plug In Digital"
    ],
    "developers": [
      "Motion Twin"
    ],
    "features": [
      "Full controller support",
      "Steam Cloud"
    ],
    "modes": [
      "Single-player"
    ],
    "video": [
      "KV6fBYuuPMg"
    ],
    "regions_excluded": [],
    "regions_included": [],
    "availability": {
      "valid_until": null,
      "valid_from": "2017-05-10T23:00:00.000Z"
    },
    "visible": {
      "valid_until": null,
      "valid_from": "2017-05-10T23:00:00.000Z"
    },
    "platform_specs": {
      "win": {
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows 7+<br></li><li><strong>Processor:</strong> Intel i5+<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> Nvidia GTX 460 / Radeon HD 7800 or better<br></li><li><strong>Storage:</strong> 500 MB available space<br></li><li><strong>Additional Notes:</strong> OpenGL 3.2+</li></ul>",
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows 7+<br></li><li><strong>Processor:</strong> Intel i5+<br></li><li><strong>Memory:</strong> 2 GB RAM<br></li><li><strong>Graphics:</strong> Nvidia 450 GTS / Radeon HD 5750 or better<br></li><li><strong>Storage:</strong> 500 MB available space<br></li><li><strong>Additional Notes:</strong> OpenGL 3.2+</li></ul>"
      }
    },
    "img": [
      {
        "order": "99",
        "slug": "630fb2de-544f-4cc5-a6b3-534078923cab.jpg",
        "alt": "630fb2de-544f-4cc5-a6b3-534078923cab"
      },
      {
        "order": "99",
        "slug": "864c3cbd-2255-4812-8499-9abea914c582.jpg",
        "alt": "864c3cbd-2255-4812-8499-9abea914c582"
      },
      {
        "order": "99",
        "slug": "1b08e9ca-5ec1-4aff-b97c-7b5d9226cfb4.jpg",
        "alt": "1b08e9ca-5ec1-4aff-b97c-7b5d9226cfb4"
      },
      {
        "order": "99",
        "slug": "e582f9f9-b9aa-48d5-a666-366ea967e8fb.jpg",
        "alt": "e582f9f9-b9aa-48d5-a666-366ea967e8fb"
      },
      {
        "slug": "704785cb-3448-406c-af00-48e431eb6ffd.jpg",
        "alt": "704785cb-3448-406c-af00-48e431eb6ffd"
      }
    ],
    "bundles": [],
    "hideDiscount": false,
    "presale": false,
    "archive": false,
    "desc": "<p><strong>- GOLDEN JOYSTICK AWARDS 2018 'BEST INDIE GAME' WINNER -</strong></p>&#10;<p>Roguelike, Rogue-lite, roguelike-like, rogueschmike! No matter what you call them, the world could always use another! As such, we'd like to present for your consideration, the illegitimate child of the roguelike and the Metroidvania, the RogueVANIA. Anywho, enough with the sales pitch, let&#8217;s take a closer look.<br/><br/>The game takes place on an immense island that never changes. All of the biomes, bosses and the paths between them are present right from the start. Getting to them is another story...<br/><br/>However, in Dead Cells, death replaces the traditional backtracking mechanic of a Metroidvania. At first, seemingly unreachable areas will be strewn across your path, but answers to these riddles will appear as you explore the island. Be it a key, a new acrobatic skill or a forgotten spell. Once uncovered, this knowledge will stay with you, allowing you to unlock new paths to your goal. Sick of the stinking sewers? Head over the ramparts and take a breath of fresh air! It&#8217;s your skill, playstyle and of course the loot you find that will determine your path.<br/><br/>Furthermore, as the term &#34;RogueVania&#34; might (not so) subtly imply, we were also quite heavily influenced by the recent wave of roguelites. When there are no checkpoints to save you from your screw-ups, the adrenaline kicks in. And when you lose, you lose big, so you&#8217;ve got to make it out alive. Instead of relying on the classic formula of memorising the level design and enemy placement, procedural generation allows us to reward your instincts, reflexes and ability to adapt to evolving situations.<br/><br/>Don&#8217;t expect it to be a walk in the park though. Pattern-based monsters and demanding boss fights will teach you to choose your battles and build your strength. Every weapon has its own unique feel and rolling and dodging will become second nature, as you learn to manage the mobs of monsters that will overwhelm the unprepared. We&#8217;re going after that &#8220;tough, but fair&#8221; feeling.<br/><br/>Tired of violence and death? Explore a bit, take a stroll, enjoy the view from the ramparts, find a secret room. Thomas and Gwen, our graphic artists, never miss an opportunity to impress with their pixelart and shape a world worth exploring. You might even learn a little more about the lore of the place, who knows?</p>&#10;<p><strong>YOUR OFFICIAL DEAD CELLS STEAM PC KEY GIVES YOU:</strong></p>&#10;<ul>&#10;<li>Progressive exploration of an interconnected world, with the replayability of a rogue-lite and the adrenaline pumping threat of permadeath</li>&#10;<li>Pattern-based bosses and minions, weapons and spells with unique gameplay. Make do with what you have and don&#8217;t forget to roll</li>&#10;<li>New levels with every death and explore undiscovered parts of the castle as you prepare for the inevitable bosses</li>&#10;<li>Secret rooms, hidden passages, charming landscapes. Death is the new backtracking</li>&#10;</ul>",
    "sdesc": null,
    "cover": "96377ebb-31f3-48b8-9f8a-2f988d1782dc.jpeg",
    "url": "https://dead-cells.com/",
    "slug": "dead-cells",
    "name": "Dead Cells",
    "display_type": "game",
    "type": "game",
    "collections": [
      "Very Positive",
      "Top Picks",
      "wishlist weekend",
      "Free Deus Ex promotion",
      "Red Hot Top Picks"
    ],
    "franchises": [
      "Dead Cells"
    ],
    "fandesc": "Dead Cells is as charming as it is addictive. A Castlevania/Metroidvania side-scroller, it's one of the few games where dying is not a frustration thanks to the new opportunities that it opens up.",
    "giveaway": false,
    "fullPrice": {
      "AUD": 2699,
      "GBP": 1699,
      "EUR": 1999,
      "USD": 1999,
      "CAD": 2299
    },
    "ubisoft_ska": false,
    "__v": 238,
    "no_release_date": false,
    "no_release_date_text": null,
    "template_type": null,
    "free_to_play": false,
    "free_to_play_url": null,
    "authors": [],
    "artists": [],
    "downloads": [],
    "showReview": true,
    "audit": [],
    "hitcardVideo": "ZE56LMonq8ilXPDj4OxRslN21N3mX8uO6X5X-480p.mp4",
    "supplier_id": "55db244ad3b050fe108b45c6",
    "currentPrice": {
      "JPY": 195300,
      "RUB": 125921,
      "AUD": 2831,
      "CAD": 2361,
      "EUR": 1967,
      "USD": 1967,
      "GBP": 1731
    },
    "current_discount": {
      "percent": 0.2125,
      "display_percentage": true,
      "until": "2021-09-22T15:59:00.000Z",
      "from": "2021-09-20T07:01:00.792Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": true,
      "highlighted": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [],
    "in_bundles": [
      {
        "_id": "600ff9d946e427007e7bbb23",
        "cover": "8a0dd0da-9c2d-462b-8aab-79fd16bad371.jpeg",
        "fullPrice": {
          "JPY": 352000,
          "RUB": 241400,
          "AUD": 5054,
          "CAD": 4197,
          "EUR": 3497,
          "USD": 3497,
          "GBP": 3097
        },
        "name": "Dead Cells - The Fatal Seed Bundle",
        "platforms": {
          "linux": true,
          "mac": true,
          "windows": true
        },
        "price": {
          "JPY": 317900,
          "RUB": 267100,
          "AUD": 4279,
          "CAD": 3822,
          "EUR": 2999,
          "USD": 2999,
          "GBP": 2699
        },
        "slug": "dead-cells-the-fatal-seed-bundle",
        "type": "bundle",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 317900,
          "RUB": 267100,
          "AUD": 4279,
          "CAD": 3822,
          "EUR": 2999,
          "USD": 2999,
          "GBP": 2699
        },
        "current_discount": {
          "percent": 0,
          "display_percentage": false
        },
        "drm_string": "steam",
        "platforms_string": "linux,mac,windows",
        "downloadTotal": 0
      }
    ],
    "packs": [],
    "base_game": null,
    "related": [
      "dead-cells-the-bad-seed",
      "dead-cells-fatal-falls"
    ],
    "recommendations": [
      "blasphemous",
      "colt-canyon",
      "monster-hunter-world",
      "everspace",
      "necropolis-brutal-edition",
      "curse-of-the-dead-gods",
      "exanima",
      "dark-souls-iii-deluxe-edition",
      "dark-souls-iii",
      "thea-the-awakening",
      "streets-of-rogue",
      "sanctuary-rpg-black-edition",
      "vertical-drop-heroes-hd",
      "dead-cells-the-fatal-seed-bundle",
      "mana-spark"
    ],
    "recommendations_challenger": [
      "blasphemous",
      "colt-canyon",
      "monster-hunter-world",
      "everspace",
      "necropolis-brutal-edition",
      "curse-of-the-dead-gods",
      "exanima",
      "dark-souls-iii-deluxe-edition",
      "dark-souls-iii",
      "thea-the-awakening",
      "streets-of-rogue",
      "sanctuary-rpg-black-edition",
      "vertical-drop-heroes-hd",
      "dead-cells-the-fatal-seed-bundle",
      "mana-spark"
    ],
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "PC Gamer",
        "message": "\"A stellar action platformer with gorgeous presentation and excellent combat. Punishing but worth it.\"",
        "url": "https://www.pcgamer.com/dead-cells-review/",
        "displayScore": "90 / 100",
        "outletImage": "https://cdn.fanatical.com/production/logos/pcgamer.jpg",
        "author": "Chris Thursten"
      },
      {
        "scoreType": "text",
        "outletName": "Eurogamer",
        "message": "\"The Metroidvania at its best: a swaggering role-playing beat-'em-up that's very easy on the eyes and dense with secrets.\"",
        "url": "https://www.eurogamer.net/articles/2018-08-06-dead-cells-review-one-of-the-slickest-metroidvanias-youll-ever-play",
        "displayScore": "Recommended",
        "outletImage": "https://cdn.fanatical.com/production/logos/eurogamer.jpg",
        "author": "Edwin Evans-Thirlwell"
      },
      {
        "scoreType": "text",
        "outletName": "IGN",
        "message": "\"Dead Cells fuses breakneck motion with an emphasis on risk-and-reward for an incredibly engaging action-platformer.\"",
        "url": "http://www.ign.com/articles/2018/08/11/dead-cells-review",
        "displayScore": "9.5 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/ign.jpg",
        "author": "Brandin Tyrrel"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/6386/dead-cells",
    "opencriticScoreString": "89% Mighty",
    "opencriticReviewCount": 146,
    "opencriticPercentRecommended": 96,
    "openCriticScore": 89,
    "videos": [
      {
        "id": "QT_9IrsaPtc",
        "title": "Dead Cells - Good Game",
        "date": "2017-07-26T19:00:03Z",
        "thumbnail_url": "https://i.ytimg.com/vi/QT_9IrsaPtc/hqdefault.jpg"
      },
      {
        "id": "bJvVF5pI7x4",
        "title": "This game is fun!?! - Dead Cells GAMEPLAY #1",
        "date": "2018-11-11T00:50:31Z",
        "thumbnail_url": "https://i.ytimg.com/vi/bJvVF5pI7x4/hqdefault.jpg"
      },
      {
        "id": "7ilfBuIZIhk",
        "title": "DEAD CELLS Is Kinda Hard",
        "date": "2020-10-20T14:54:16Z",
        "thumbnail_url": "https://i.ytimg.com/vi/7ilfBuIZIhk/hqdefault.jpg"
      },
      {
        "id": "QCgwxlgH2Jo",
        "title": "Putting the dead in dead cells - youtube&#39;s worst gaming channel",
        "date": "2018-06-28T05:56:44Z",
        "thumbnail_url": "https://i.ytimg.com/vi/QCgwxlgH2Jo/hqdefault.jpg"
      },
      {
        "id": "_rgK4Ev_DyU",
        "title": "Upgrades Abound - I&#39;m Bad at Games - Dead Cells E2",
        "date": "2017-09-04T00:00:00Z",
        "thumbnail_url": "https://i.ytimg.com/vi/_rgK4Ev_DyU/hqdefault.jpg"
      },
      {
        "id": "u5jOFrggzCc",
        "title": "Dead Cells - if you try the game with no scrolls, no amulets and electric whip only",
        "date": "2021-07-19T16:59:40Z",
        "thumbnail_url": "https://i.ytimg.com/vi/u5jOFrggzCc/hqdefault.jpg"
      },
      {
        "id": "7KuTM9tQoqE",
        "title": "DEAD CELLS WALKTHROUGH - #5 || Gaming Everyday",
        "date": "2019-07-02T19:14:24Z",
        "thumbnail_url": "https://i.ytimg.com/vi/7KuTM9tQoqE/hqdefault.jpg"
      },
      {
        "id": "jyRiVwrOTTk",
        "title": "DEAD CELLS WALKTHROUGH - #4 || Gaming Everyday",
        "date": "2019-06-27T11:32:43Z",
        "thumbnail_url": "https://i.ytimg.com/vi/jyRiVwrOTTk/hqdefault.jpg"
      }
    ],
    "userReviewData": {
      "reviews": [
        {
          "_id": "612de7f58c172940e1cf97f9",
          "slug": "dead-cells",
          "rating": 5,
          "display_name": "Sam Jones",
          "title": "Dead Cells Review",
          "text": "Dead Cells is as charming as it is addictive. A Castlevania/Metroidvania side-scroller, it's one of the few games where dying is not a frustration thanks to the new opportunities that it opens up.",
          "date": "2021-08-31T08:27:33.216Z",
          "staff_review": true,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "59148d10789c68307354f860",
          "version_id": "612de7f58c172940e1cf97f8",
          "published": true,
          "has_active_version": true
        }
      ]
    },
    "relatedHits": [
      {
        "product_id": "600ad4a30222610085501287",
        "sku": "PCD18006",
        "name": "Dead Cells: Fatal Falls",
        "slug": "dead-cells-fatal-falls",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "b18da3f1-f32e-4aa3-96bc-d770860e0563.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 4.49,
          "EUR": 4.99,
          "USD": 4.99,
          "CAD": 6.29,
          "AUD": 7.09,
          "RUB": 441,
          "JPY": 520
        },
        "fullPrice": {
          "GBP": 4.49,
          "EUR": 4.99,
          "USD": 4.99,
          "CAD": 6.29,
          "AUD": 7.09,
          "RUB": 441,
          "JPY": 520
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "EZgMSdfwsc0"
        ],
        "available_valid_from": 1611676800,
        "available_valid_until": 32535216000,
        "release_date": 1611676800,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "1711426a-83f2-4c21-a981-f8903e01c851.jpeg",
          "91287fed-a825-4542-9f50-d2d0c429d799.jpeg",
          "45a40672-85d9-4e5b-b5ae-f36ac366c3c3.jpeg",
          "836d4c48-7146-4018-b867-169f6fd89c9a.jpeg",
          "bfccf438-3b2f-4145-b702-3f03f25a3a62.jpeg",
          "78b2fdb1-4a53-4231-aab6-3cee4318a789.jpeg"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 15,
          "USK": 12,
          "PEGI": 16,
          "ESRB": 13
        },
        "objectID": "5356945002"
      },
      {
        "product_id": "5e37fcb7e5364e1c83d6bc09",
        "sku": "PCD14131",
        "name": "Dead Cells: The Bad Seed",
        "slug": "dead-cells-the-bad-seed",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "a0580cb1-2671-44ab-9e3f-bf640d0d14cd.jpeg",
        "tiered": false,
        "discount_percent": 21,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 3.53,
          "EUR": 3.92,
          "USD": 3.92,
          "CAD": 4.48,
          "AUD": 5.9,
          "RUB": 294.52,
          "JPY": 409.5
        },
        "fullPrice": {
          "GBP": 4.49,
          "EUR": 4.99,
          "USD": 4.99,
          "CAD": 5.69,
          "AUD": 7.5,
          "RUB": 374,
          "JPY": 520
        },
        "operating_systems": [
          "windows",
          "mac",
          "linux"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Steam trading cards",
          "Full controller support",
          "Steam achievements"
        ],
        "collections": [],
        "video": [
          "mdNovVWIPt0"
        ],
        "available_valid_from": 1632121260,
        "available_valid_until": 1632326340,
        "release_date": 1581379200,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "93a4d9ce-1f2a-4128-861e-8213f4490dc7.png",
          "dad7bfbb-76d1-4753-b460-09b3b8242626.png",
          "be89c03e-2f25-41aa-83a9-6f6442093410.png",
          "f4f2cc85-c98a-4cb1-a166-417a11750316.png",
          "0f4bdc40-33ab-4cfa-8c4e-ff004b3a25ee.png",
          "2f009444-2b71-42c1-9170-bc47ef6a8298.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 16,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5352183002"
      }
    ],
    "userReviewSummary": {
      "rating_score": 5,
      "total_ratings": 3,
      "percent_recommended": 67,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 0,
        "four_star_percentage": 0,
        "five_star_percentage": 100
      },
      "reviewLocales": [
        "en"
      ],
      "total_written_reviews": 1
    },
    "streams": [
      {
        "id": "43312623292",
        "user_name": "RabiTheWise",
        "type": "live",
        "title": "Ok Fine, I'm Awake: Dead Cells: Trying For The Fifth Boss Cell Again",
        "started_at": "2021-09-20T06:28:29Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_rabithewise-{width}x{height}.jpg"
      },
      {
        "id": "43312053740",
        "user_name": "Tanklike441",
        "type": "live",
        "title": "Dead Cells now! Variety stream night! || Suggest me a game! || !schedule",
        "started_at": "2021-09-20T02:50:00Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_tanklike441-{width}x{height}.jpg"
      },
      {
        "id": "43312869852",
        "user_name": "Guigt",
        "type": "live",
        "title": "Un petit peu de Dead Cells puis on part sur rimworld",
        "started_at": "2021-09-20T08:21:20Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_guigt-{width}x{height}.jpg"
      },
      {
        "id": "43303407660",
        "user_name": "sunrageee",
        "type": "live",
        "title": "хз\n\n",
        "started_at": "2021-09-19T07:33:25Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sunrageee-{width}x{height}.jpg"
      },
      {
        "id": "43747588877",
        "user_name": "TheoryOfAllThings",
        "type": "live",
        "title": "[Rerun] For live streams go to AnkisTV: www.twitch.tv/AnkisTV",
        "started_at": "2021-09-18T21:48:17Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_theoryofallthings-{width}x{height}.jpg"
      },
      {
        "id": "39990465995",
        "user_name": "Senchiowns",
        "type": "live",
        "title": "Join Me on My First Playthrough DeadCells",
        "started_at": "2021-09-20T08:58:02Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_senchiowns-{width}x{height}.jpg"
      },
      {
        "id": "39990101115",
        "user_name": "itsmethatoneguy1",
        "type": "live",
        "title": "Drinks, chat, and games! (and for a limited time, Guy's face?",
        "started_at": "2021-09-20T05:55:17Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_itsmethatoneguy1-{width}x{height}.jpg"
      },
      {
        "id": "43767444333",
        "user_name": "indezo",
        "type": "live",
        "title": "Смотрим обновление в Dead Cells",
        "started_at": "2021-09-20T08:26:00Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_indezo-{width}x{height}.jpg"
      }
    ]
  },
  {
    "_id": "5e6f5737e5364e1c83d9b06e",
    "__v": 139,
    "age": {
      "ESRB": 17,
      "PEGI": 18,
      "USK": 0,
      "ACB": 0
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_from": "2020-03-16T00:00:00.000Z",
      "valid_until": null
    },
    "bundles": [],
    "collections": [
      "Red Hot Top Picks"
    ],
    "cover": "ce7f4e07-5c57-4d74-af0e-3a6718162e3f.jpeg",
    "developers": [
      "Gearbox Software"
    ],
    "display_type": "game",
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "features": [
      "Online Coop",
      "LAN Coop",
      "CrossPlatform Multiplayer",
      "Steam Achievements",
      "Full controller support",
      "Steam Trading Cards",
      "Steam Cloud"
    ],
    "franchises": [
      "Borderlands",
      "Borderlands 3"
    ],
    "genres": [
      "Action",
      "RPG"
    ],
    "img": [
      {
        "alt": "ceb68006-aa3c-4b8b-b9e1-7787fc35fe0f.png",
        "slug": "ceb68006-aa3c-4b8b-b9e1-7787fc35fe0f.png",
        "order": "99"
      },
      {
        "alt": "331e6647-36a4-4b95-bbc6-afa3aa00def3.png",
        "slug": "331e6647-36a4-4b95-bbc6-afa3aa00def3.png",
        "order": "99"
      },
      {
        "alt": "2c106311-e2ab-4fd3-9a9a-137890090dda.png",
        "slug": "2c106311-e2ab-4fd3-9a9a-137890090dda.png",
        "order": "99"
      },
      {
        "alt": "889e93dc-b551-47d7-a41e-7eda5a16012e.png",
        "slug": "889e93dc-b551-47d7-a41e-7eda5a16012e.png",
        "order": "99"
      },
      {
        "alt": "951adfc0-7006-4472-a13d-aae9ea0137be.png",
        "slug": "951adfc0-7006-4472-a13d-aae9ea0137be.png",
        "order": "99"
      },
      {
        "alt": "839b2460-f68f-4274-83ee-1521e2ac89e9.png",
        "slug": "839b2460-f68f-4274-83ee-1521e2ac89e9.png",
        "order": "99"
      },
      {
        "alt": "63e6b1b7-b852-43c1-9341-a89e86791f85.png",
        "slug": "63e6b1b7-b852-43c1-9341-a89e86791f85.png",
        "order": "99"
      },
      {
        "alt": "3dda77d2-e842-4f1f-985a-712ed06fcd88.png",
        "slug": "3dda77d2-e842-4f1f-985a-712ed06fcd88.png"
      }
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish - Spain",
      "Japanese",
      "Korean",
      "Portuguese - Brazil",
      "Russian",
      "Simplified Chinese",
      "Traditional Chinese"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer",
      "Coop"
    ],
    "name": "Borderlands 3 - Super Deluxe Edition",
    "notice": {
      "legal": "© 2019 Gearbox. Published and distributed by 2K. Gearbox and Borderlands, and the Gearbox Software and Borderlands logos, are registered trademarks, all used courtesy of Gearbox Software, LLC. 2K and the 2K logo are trademarks of Take-Two Interactive Software, Inc. All rights reserved."
    },
    "platform_specs": {
      "win": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows 7/10 (latest service pack)<br></li><li><strong>Processor:</strong> AMD FX-8350 or Intel i5-3570<br></li><li><strong>Memory:</strong> 6 GB RAM<br></li><li><strong>Graphics:</strong> AMD Radeon™ HD 7970 or NVIDIA GeForce GTX 680 2 GB<br></li><li><strong>DirectX:</strong> Version 11<br></li><li><strong>Storage:</strong> 75 GB available space<br></li><li><strong>Sound Card:</strong> DirectX Compatible</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows 7/10 (latest service pack)<br></li><li><strong>Processor:</strong> AMD Ryzen™ 5 2600 (Intel i7-4770)<br></li><li><strong>Memory:</strong> 16 GB RAM<br></li><li><strong>Graphics:</strong> AMD Radeon™ RX 590 or NVIDIA GeForce GTX 1060 6GB<br></li><li><strong>DirectX:</strong> Version 12<br></li><li><strong>Storage:</strong> 75 GB available space<br></li><li><strong>Sound Card:</strong> DirectX Compatible</li></ul>"
      }
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 1028000,
      "RUB": 909600,
      "AUD": 10995,
      "CAD": 9999,
      "EUR": 7999,
      "USD": 7999,
      "GBP": 6499
    },
    "publishers": [
      "2K Games"
    ],
    "quotes": [],
    "release": "2020-03-16T09:49:15.231Z",
    "seo": {
      "desc": "Witness the return of the original shooter-looter franchise and get ready for the mayhem with your Borderlands 3 - Super Deluxe Edition Steam PC key. Includes the base game, Season Pass and Deluxe bonus content!",
      "title": null
    },
    "showReview": true,
    "slug": "borderlands-3-super-deluxe-edition",
    "steam": {
      "packages": [],
      "dlc": [
        1232252,
        1233062,
        1232256,
        1232254,
        1232253,
        1232255,
        1232251
      ],
      "release": "2020-03-13T00:00:00.000Z",
      "id": null,
      "type": "app"
    },
    "type": "game",
    "url": "https://www.borderlands.com",
    "video": [
      "d9Gu1PspA3Y"
    ],
    "visible": {
      "valid_from": "2020-03-16T00:00:00.000Z",
      "valid_until": null
    },
    "regions_excluded": [],
    "regions_included": [
      {
        "name": "Andorra",
        "code": "AD",
        "_id": "5e6f575c0531e90085188d3f"
      },
      {
        "name": "Austria",
        "code": "AT",
        "_id": "5e6f575c0531e90085188d3e"
      },
      {
        "name": "Belgium",
        "code": "BE",
        "_id": "5e6f575c0531e90085188d3d"
      },
      {
        "name": "Bosnia and Herzegovina",
        "code": "BA",
        "_id": "5e6f575c0531e90085188d3c"
      },
      {
        "name": "Bulgaria",
        "code": "BG",
        "_id": "5e6f575c0531e90085188d3b"
      },
      {
        "name": "Croatia",
        "code": "HR",
        "_id": "5e6f575c0531e90085188d3a"
      },
      {
        "name": "Cyprus",
        "code": "CY",
        "_id": "5e6f575c0531e90085188d39"
      },
      {
        "name": "Czech Republic",
        "code": "CZ",
        "_id": "5e6f575c0531e90085188d38"
      },
      {
        "name": "Denmark",
        "code": "DK",
        "_id": "5e6f575c0531e90085188d37"
      },
      {
        "name": "Estonia",
        "code": "EE",
        "_id": "5e6f575c0531e90085188d36"
      },
      {
        "name": "Faroe Islands",
        "code": "FO",
        "_id": "5e6f575c0531e90085188d35"
      },
      {
        "name": "Finland",
        "code": "FI",
        "_id": "5e6f575c0531e90085188d34"
      },
      {
        "name": "France",
        "code": "FR",
        "_id": "5e6f575c0531e90085188d33"
      },
      {
        "name": "Germany",
        "code": "DE",
        "_id": "5e6f575c0531e90085188d32"
      },
      {
        "name": "Gibraltar",
        "code": "GI",
        "_id": "5e6f575c0531e90085188d31"
      },
      {
        "name": "Greece",
        "code": "GR",
        "_id": "5e6f575c0531e90085188d30"
      },
      {
        "name": "Holy See (Vatican City State)",
        "code": "VA",
        "_id": "5e6f575c0531e90085188d2f"
      },
      {
        "name": "Hungary",
        "code": "HU",
        "_id": "5e6f575c0531e90085188d2e"
      },
      {
        "name": "Iceland",
        "code": "IS",
        "_id": "5e6f575c0531e90085188d2d"
      },
      {
        "name": "Ireland",
        "code": "IE",
        "_id": "5e6f575c0531e90085188d2c"
      },
      {
        "name": "Isle of Man",
        "code": "IM",
        "_id": "5e6f575c0531e90085188d2b"
      },
      {
        "name": "Italy",
        "code": "IT",
        "_id": "5e6f575c0531e90085188d2a"
      },
      {
        "name": "Latvia",
        "code": "LV",
        "_id": "5e6f575c0531e90085188d29"
      },
      {
        "name": "Liechtenstein",
        "code": "LI",
        "_id": "5e6f575c0531e90085188d28"
      },
      {
        "name": "Lithuania",
        "code": "LT",
        "_id": "5e6f575c0531e90085188d27"
      },
      {
        "name": "Luxembourg",
        "code": "LU",
        "_id": "5e6f575c0531e90085188d26"
      },
      {
        "name": "Macedonia, the Former Yugoslav Republic of",
        "code": "MK",
        "_id": "5e6f575c0531e90085188d25"
      },
      {
        "name": "Malta",
        "code": "MT",
        "_id": "5e6f575c0531e90085188d24"
      },
      {
        "name": "Moldova, Republic of",
        "code": "MD",
        "_id": "5e6f575c0531e90085188d23"
      },
      {
        "name": "Monaco",
        "code": "MC",
        "_id": "5e6f575c0531e90085188d22"
      },
      {
        "name": "Montenegro",
        "code": "ME",
        "_id": "5e6f575c0531e90085188d21"
      },
      {
        "name": "Netherlands",
        "code": "NL",
        "_id": "5e6f575c0531e90085188d20"
      },
      {
        "name": "Norway",
        "code": "NO",
        "_id": "5e6f575c0531e90085188d1f"
      },
      {
        "name": "Poland",
        "code": "PL",
        "_id": "5e6f575c0531e90085188d1e"
      },
      {
        "name": "Portugal",
        "code": "PT",
        "_id": "5e6f575c0531e90085188d1d"
      },
      {
        "name": "Romania",
        "code": "RO",
        "_id": "5e6f575c0531e90085188d1c"
      },
      {
        "name": "San Marino",
        "code": "SM",
        "_id": "5e6f575c0531e90085188d1b"
      },
      {
        "name": "Serbia",
        "code": "RS",
        "_id": "5e6f575c0531e90085188d1a"
      },
      {
        "name": "Slovakia",
        "code": "SK",
        "_id": "5e6f575c0531e90085188d19"
      },
      {
        "name": "Spain",
        "code": "ES",
        "_id": "5e6f575c0531e90085188d18"
      },
      {
        "name": "Sweden",
        "code": "SE",
        "_id": "5e6f575c0531e90085188d17"
      },
      {
        "name": "Switzerland",
        "code": "CH",
        "_id": "5e6f575c0531e90085188d16"
      },
      {
        "name": "United Kingdom",
        "code": "GB",
        "_id": "5e6f575c0531e90085188d15"
      }
    ],
    "downloads": [],
    "template_type": "standard",
    "audit": [],
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "free_redeem_code": null,
    "desc": "<p>Witness the return of the original shooter-looter franchise and get ready for the mayhem with your Borderlands 3 - Super Deluxe Edition Steam PC key. Including the base game, Season Pass and Deluxe bonus content!</p>&#10;<p>Packing bazillions of guns and an all-new mayhem-fueled adventure, you'll blast through new worlds and enemies as one of four brand new Vault Hunters &#8211; the ultimate treasure-seeking badasses of the Borderlands, each with deep skill trees, abilities and customization.</p>&#10;<p>Play solo or join with friends to take on insane enemies, score loads of loot and save your home from the most ruthless cult leaders in the galaxy.</p>&#10;<p><strong>A MAYHEM-FUELED THRILL RIDE<br/></strong>Stop the fanatical Calypso Twins from uniting the bandit clans and claiming the galaxy&#8217;s ultimate power. Only you, a thrill-seeking Vault Hunter, have the arsenal and allies to take them down.</p>&#10;<p><strong>YOUR VAULT HUNTER, YOUR PLAYSTYLE<br/></strong>Become one of four extraordinary Vault Hunters, each with unique abilities, playstyles, deep skill trees, and tons of personalization options. All Vault Hunters are capable of awesome mayhem alone, but together they are unstoppable.</p>&#10;<p><strong>Moze as THE GUNNER:</strong>&#160;When Moze needs backup she Digistructs her mech &#8211; Iron Bear &#8211; for a sucker punch of additional firepower.</p>&#10;<p><strong>Amara as THE SIREN:</strong>&#160;A confident, capable brawler with the ability to summon ethereal fists, Amara uses her Siren powers to smash her enemies.</p>&#10;<p><strong>FL4K as the BEASTMASTER:</strong>&#160;FL4K lives for the hunt. So do the loyal beasts that follow their master&#8217;s every command. Their preferred prey? Unsuspecting bandits, those poor suckers.</p>&#10;<p><strong>Zane as the OPERATIVE:</strong>&#160;Specializing in battlefield gadgetry, Zane is extremely proficient at slipping into combat, creating chaos, and sneaking back out as if he were never there.</p>&#10;<p><strong>LOCK, LOAD, AND LOOT<br/></strong>With bazillions of guns and gadgets, every fight is an opportunity to score new gear. Firearms with self-propelling bullet shields? Check. Rifles that spawn fire-spewing volcanoes? Obviously. Guns that grow legs and chase down enemies while hurling verbal insults? Yeah, got that too.</p>&#10;<p><strong>NEW BORDERLANDS<br/></strong>Discover new worlds beyond Pandora, each featuring unique environments to explore and enemies to destroy. Tear through hostile deserts, battle your way across war-torn cityscapes, navigate deadly bayous and more!</p>&#10;<p><strong>QUICK &amp; SEAMLESS CO-OP ACTION<br/></strong>Play with anyone at any time online or in split-screen co-op, regardless of your level or mission progress. Take down enemies and challenges as a team, but reap rewards that are yours alone &#8211; no one misses out on loot.</p>&#10;<p><strong>YOUR OFFICIAL BORDERLANDS 3 - SUPER DELUXE EDITION STEAM PC KEY GIVES YOU:</strong></p>&#10;<ul>&#10;<li>Chaotic shooter-looter action.</li>&#10;<li>Bazillions of guns and gadgets.</li>&#10;<li>Four playable Vault Hunters with unique abilities and playstyles.</li>&#10;<li>Season Pass content: Four&#160;campaign DLC packs featuring new stories, missions and challenges, Butt Stallion weapon skin, trinket, and grenade mod.</li>&#10;<li>Deluxe Bonus Content Pack: Retro Cosmetic Pack, Neon Cosmetic Pack, Gearbox Cosmetic Pack, Toy Box Weapon Pack, and Equippable XP &amp; Loot Drop Boost Mods.</li>&#10;</ul>",
    "hitcardVideo": "WAQZqVv6n1t1V6AwnRD3UX8WGkKnDZHQo2-480p.mp4",
    "genba_id": "fc926ccb-a2b6-4cb4-b18b-571ec4a14f9a",
    "parent_slug": "borderlands-3",
    "supplier_id": "57b703b8039e930e00a21cd9",
    "currentPrice": {
      "JPY": 884080,
      "RUB": 782256,
      "AUD": 9455,
      "CAD": 8599,
      "EUR": 6879,
      "USD": 6879,
      "GBP": 5589
    },
    "current_discount": {
      "percent": 0.14,
      "display_percentage": true,
      "until": "2021-09-20T15:59:00.000Z",
      "from": "2021-09-18T07:01:00.800Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": true,
      "highlighted": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "bundles": [],
        "cover": "381d7788-ccc9-42e0-a237-00cd329b69eb.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "Borderlands 3",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 798000,
          "RUB": 524800,
          "AUD": 8995,
          "CAD": 7999,
          "EUR": 5999,
          "USD": 5999,
          "GBP": 4999
        },
        "slug": "borderlands-3",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 686280,
          "RUB": 451328,
          "AUD": 7735,
          "CAD": 6879,
          "EUR": 5159,
          "USD": 5159,
          "GBP": 4299
        },
        "current_discount": {
          "percent": 0.14,
          "display_percentage": true,
          "until": "2021-09-22T15:59:00.000Z",
          "from": "2021-09-20T07:01:00.792Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Standard Edition"
      },
      {
        "bundles": [],
        "cover": "ce7f4e07-5c57-4d74-af0e-3a6718162e3f.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "Borderlands 3 - Super Deluxe Edition",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 1028000,
          "RUB": 909600,
          "AUD": 10995,
          "CAD": 9999,
          "EUR": 7999,
          "USD": 7999,
          "GBP": 6499
        },
        "slug": "borderlands-3-super-deluxe-edition",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 884080,
          "RUB": 782256,
          "AUD": 9455,
          "CAD": 8599,
          "EUR": 6879,
          "USD": 6879,
          "GBP": 5589
        },
        "current_discount": {
          "percent": 0.14,
          "display_percentage": true,
          "until": "2021-09-20T15:59:00.000Z",
          "from": "2021-09-18T07:01:00.800Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Super Deluxe Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [
      "borderlands-3-psycho-krieg-and-the-fantastic-fuster-cluck"
    ],
    "edition_name": "Super Deluxe Edition",
    "recommendations": [
      "borderlands-3-epic",
      "borderlands-3-ultimate-edition-epic",
      "borderlands-3-ultimate-edition",
      "borderlands-2-game-of-the-year-edition",
      "borderlands-3-season-pass-2-epic",
      "borderlands-3-season-pass-2",
      "borderlands-2-aspyr",
      "borderlands-2",
      "borderlands-the-pre-sequel-season-pass-aspyr-pack",
      "monster-hunter-world-iceborne",
      "borderlands-the-pre-sequel-ultimate-vault-hunter-upgrade-pack-the-holodome-onslaught",
      "unrailed",
      "fallout-3-game-of-the-year-edition",
      "nova-drift",
      "iron-harvest"
    ],
    "recommendations_challenger": [
      "borderlands-3",
      "borderlands-3-epic",
      "borderlands-3-ultimate-edition-epic",
      "borderlands-3-ultimate-edition",
      "borderlands-2-game-of-the-year-edition",
      "borderlands-3-season-pass-2-epic",
      "borderlands-3-season-pass-2",
      "borderlands-2-aspyr",
      "borderlands-2",
      "borderlands-the-pre-sequel-season-pass-aspyr-pack",
      "monster-hunter-world-iceborne",
      "borderlands-the-pre-sequel-ultimate-vault-hunter-upgrade-pack-the-holodome-onslaught",
      "unrailed",
      "fallout-3-game-of-the-year-edition",
      "nova-drift"
    ],
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "Game Informer",
        "message": "\"Borderlands 3 is a love letter to its fans and a celebration of the style of play it first popularized. Filled with characters from previous installments, and unapologetic in its silly humor and bombastic action, it’s an amusing ride that seems hesitant to innovate.\"",
        "url": "https://www.gameinformer.com/review/borderlands-3/borderlands-3-review-sticking-to-its-guns",
        "displayScore": "8 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/gameinformer.jpg",
        "author": "Matt Miller"
      },
      {
        "scoreType": "text",
        "outletName": "IGN",
        "message": "\"Borderlands 3 sticks to its guns and outdoes itself with an amazing arsenal of weapons, humor, and missions.\"",
        "url": "http://www.ign.com/articles/2019/09/09/borderlands-3-review",
        "displayScore": "9 / 10",
        "outletImage": "https://cdn.fanatical.com/production/logos/ign.jpg",
        "author": "James Duggan"
      },
      {
        "scoreType": "text",
        "outletName": "Easy Allies",
        "message": "\"Borderlands 3 isn't a huge step forward, but its ridiculous brand of mayhem confidently expands on the distinctive strengths of the series.\"",
        "url": "https://www.youtube.com/watch?v=bsqQC9kkrno",
        "displayScore": "8.5 / 10",
        "outletImage": "",
        "author": "Daniel Bloodworth"
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/7656/borderlands-3",
    "opencriticScoreString": "80% Strong",
    "opencriticReviewCount": 135,
    "opencriticPercentRecommended": 78,
    "openCriticScore": 80,
    "videos": [
      {
        "id": "taG3ZMCD_yw",
        "title": "BULLETS, BLOOD, AND BADASSES - Borderlands 3: Super Deluxe Edition",
        "date": "2020-07-09T03:55:07Z",
        "thumbnail_url": "https://i.ytimg.com/vi/taG3ZMCD_yw/hqdefault.jpg"
      },
      {
        "id": "fTWT-hjvNhw",
        "title": "Borderlands® 3| super deluxe edition| episode 1",
        "date": "2021-07-23T20:04:07Z",
        "thumbnail_url": "https://i.ytimg.com/vi/fTWT-hjvNhw/hqdefault.jpg"
      },
      {
        "id": "c7CNI-sYb-E",
        "title": "Borderlands 3 Super Deluxe Edition",
        "date": "2020-04-04T01:36:26Z",
        "thumbnail_url": "https://i.ytimg.com/vi/c7CNI-sYb-E/hqdefault.jpg"
      },
      {
        "id": "Ej4dwCkLf4M",
        "title": "borderlands 3 super deluxe edition with all dlc and music come playing with viewers",
        "date": "2019-09-28T02:01:42Z",
        "thumbnail_url": "https://i.ytimg.com/vi/Ej4dwCkLf4M/hqdefault.jpg"
      },
      {
        "id": "G8PX9MU5Mbs",
        "title": "BORDERLANDS 3 SUPER DELUXE EDITION",
        "date": "2019-09-22T21:58:32Z",
        "thumbnail_url": "https://i.ytimg.com/vi/G8PX9MU5Mbs/hqdefault.jpg"
      },
      {
        "id": "0GDXu66H9fc",
        "title": "Super deluxe edition borderlands 3 ep 2",
        "date": "2019-10-26T22:12:02Z",
        "thumbnail_url": "https://i.ytimg.com/vi/0GDXu66H9fc/hqdefault.jpg"
      },
      {
        "id": "eB7z2dJaPjg",
        "title": "Borderlands® 3 Super Deluxe Edition maya meet part",
        "date": "2019-09-19T21:05:47Z",
        "thumbnail_url": "https://i.ytimg.com/vi/eB7z2dJaPjg/hqdefault.jpg"
      },
      {
        "id": "63skOJZVU9g",
        "title": "Borderlands 3 &quot;Buttplug&quot; Unique Gear Guide!",
        "date": "2021-01-29T21:00:02Z",
        "thumbnail_url": "https://i.ytimg.com/vi/63skOJZVU9g/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "XoNiuxMAACEANqsZ",
        "uid": "borderlands-3-super-deluxe-edition-whats-included",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22XoNiuxMAACEANqsZ%22%29+%5D%5D",
        "tags": [
          "Borderlands 3",
          "2K",
          "Borderlands",
          "Super Deluxe Edition",
          "What's Included",
          "Steam PC"
        ],
        "first_publication_date": "2020-03-31T16:51:05+0000",
        "last_publication_date": "2020-03-31T16:51:05+0000",
        "slugs": [
          "borderlands-3-super-deluxe-edition---whats-included"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2020-03-31T16:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Borderlands 3 Super Deluxe Edition - What's included",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/99b55eb1-e25f-436a-ae33-89891c83f397_borderlands-3-faq-2.jpg?auto=compress,format&rect=0,0,1570,883&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/99b55eb1-e25f-436a-ae33-89891c83f397_borderlands-3-faq-2.jpg?auto=compress,format&rect=0,0,1570,883&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/99b55eb1-e25f-436a-ae33-89891c83f397_borderlands-3-faq-2.jpg?auto=compress,format&rect=0,0,1570,883&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/99b55eb1-e25f-436a-ae33-89891c83f397_borderlands-3-faq-2.jpg?auto=compress,format&rect=0,0,1570,883&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Check out the loot available in the top edition of the latest shooter-looter",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "XXtw3hAAACMASs-g",
        "uid": "unlock-special-in-game-rewards-with-these-rare-borderlands-3-codes",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22XXtw3hAAACMASs-g%22%29+%5D%5D",
        "tags": [
          "Borderlands 3",
          "2K",
          "Gearbox",
          "Codes",
          "Shooter-looter",
          "Action",
          "FPS"
        ],
        "first_publication_date": "2019-09-13T11:53:11+0000",
        "last_publication_date": "2019-09-13T11:53:11+0000",
        "slugs": [
          "unlock-special-in-game-rewards-with-these-rare-borderlands-3-codes"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2019-09-13T11:30:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Unlock special in-game rewards with these rare Borderlands 3 codes",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/7ede3f3d095697fd3219418cf2d83f2c6552cb3d_bl3_calypsotwins.jpeg?auto=compress,format",
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/dc599c047f2b67e08629014192e60f0dac5d27f4_bl3_calypsotwins.jpeg?auto=compress,format"
            },
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/69861854fec09446b8d1ad39d8919a44c9dd5eb3_bl3_calypsotwins.jpeg?auto=compress,format"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/7f16e564dca4329cc9ce037343f52e5e4c1d0b1a_bl3_calypsotwins.jpeg?auto=compress,format"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "SHiFT Codes are back and they're packed with special loot",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {
      "rating_score": 4,
      "total_ratings": 2,
      "percent_recommended": 100,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 50,
        "four_star_percentage": 0,
        "five_star_percentage": 50
      },
      "reviewLocales": [],
      "total_written_reviews": 0
    },
    "relatedHits": [
      {
        "product_id": "5f58ac15e5364e1c83e9ff33",
        "sku": "PCD16642ROW",
        "name": "Borderlands 3 - Psycho Krieg and the Fantastic FusterCluck",
        "slug": "borderlands-3-psycho-krieg-and-the-fantastic-fuster-cluck",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "d5c08191-d170-41f6-b54b-a8ec88c1cbb4.jpeg",
        "tiered": false,
        "discount_percent": 14,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 10.31,
          "EUR": 12.89,
          "USD": 12.89,
          "CAD": 17.19,
          "AUD": 19.73,
          "RUB": 1154.12,
          "JPY": 1625.4
        },
        "fullPrice": {
          "GBP": 11.99,
          "EUR": 14.99,
          "USD": 14.99,
          "CAD": 19.99,
          "AUD": 22.95,
          "RUB": 1342,
          "JPY": 1890
        },
        "operating_systems": [
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [],
        "collections": [],
        "video": [
          "8-LN9xU9lLQ"
        ],
        "available_valid_from": 1632121260,
        "available_valid_until": 1632326340,
        "release_date": 1599753600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "00c41645-9437-42b8-9ec3-6f71e375aef8.jpeg",
          "5b0f72b3-7500-484b-872e-27c0a4f6627a.jpeg",
          "527a3b71-c9e0-410b-89dc-676c735ecdd7.jpeg",
          "87294896-3e05-4009-a1a1-55dc20bbe2a9.jpeg",
          "ef07c532-c358-4416-82e5-a28dbf9d7d19.jpeg",
          "aae65811-35fe-4fc7-92ac-1e55a22e3d02.jpeg"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "KVkOVGRPnjFy5DVon3g0ilE8KPY7JKF24-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "KVkOVGRPnjFy5DVon3g0ilE8KPY7JKF24-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "KVkOVGRPnjFy5DVon3g0ilE8KPY7JKF24-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "KVkOVGRPnjFy5DVon3g0ilE8KPY7JKF24-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "KVkOVGRPnjFy5DVon3g0ilE8KPY7JKF24-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "KVkOVGRPnjFy5DVon3g0ilE8KPY7JKF24-240p.webm"
          }
        ],
        "video_clip_poster": "KVkOVGRPnjFy5DVon3g0ilE8KPY7JKF24-poster.jpg",
        "age_ratings": {
          "ACB": 0,
          "USK": 18,
          "PEGI": 18,
          "ESRB": 17
        },
        "objectID": "5355193002"
      }
    ],
    "streams": [
      {
        "id": "43311847660",
        "user_name": "MissMynxi",
        "type": "live",
        "title": "💀 Sunday Pew Pews! :D [CC]💀!cmd !clips !song !dist !cc !patreon",
        "started_at": "2021-09-20T02:03:00Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_missmynxi-{width}x{height}.jpg"
      },
      {
        "id": "43312888972",
        "user_name": "grizzzly_gaming",
        "type": "live",
        "title": "ZANE MAIN|| LITE Gaming || RSA",
        "started_at": "2021-09-20T08:29:08Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_grizzzly_gaming-{width}x{height}.jpg"
      },
      {
        "id": "43766005549",
        "user_name": "K3ltris",
        "type": "live",
        "title": "its SUB-tember! aiming for 100 subs for this months goal! lets get it done! come say hi! echocast on! having a crap day come tell me jokes!",
        "started_at": "2021-09-20T04:21:29Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_k3ltris-{width}x{height}.jpg"
      },
      {
        "id": "43312570412",
        "user_name": "CatThePilot",
        "type": "live",
        "title": "Таки добрался до этого прекрасного творения. Утречка!",
        "started_at": "2021-09-20T06:00:36Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_catthepilot-{width}x{height}.jpg"
      },
      {
        "id": "43765955069",
        "user_name": "TruthL1ves",
        "type": "live",
        "title": "[Xbox] Borderlands 3 New Character!\n\n",
        "started_at": "2021-09-20T04:15:06Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_truthl1ves-{width}x{height}.jpg"
      },
      {
        "id": "39990395963",
        "user_name": "CreatureoftheUnknown",
        "type": "live",
        "title": "Back into the Borderlands. Farming.",
        "started_at": "2021-09-20T08:18:17Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_creatureoftheunknown-{width}x{height}.jpg"
      },
      {
        "id": "43766116637",
        "user_name": "LHthy",
        "type": "live",
        "title": "Fortnite Tomorrow | Borderlands NOW",
        "started_at": "2021-09-20T04:35:44Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_lhthy-{width}x{height}.jpg"
      },
      {
        "id": "43767594717",
        "user_name": "AraroraOackencrown",
        "type": "live",
        "title": "(Borderland III) Monday is for Game Night :)",
        "started_at": "2021-09-20T08:58:51Z",
        "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_araroraoackencrown-{width}x{height}.jpg"
      }
    ]
  },
  {
    "_id": "5e20327ee5364e1c839c6909",
    "__v": 38,
    "age": {
      "audio": 0,
      "book": 0,
      "ACB": 0,
      "USK": 0,
      "PEGI": 16,
      "ESRB": 0
    },
    "archive": false,
    "artists": [],
    "authors": [],
    "availability": {
      "valid_from": "2018-09-24T23:00:00.000Z",
      "valid_until": null
    },
    "bundles": [],
    "collections": [
      "Free Deus Ex promotion",
      "Spring Flash Deal",
      "Spring Sale Encore 2021"
    ],
    "cover": "7e630a97-d8e0-47b1-8836-d057576790ff.jpeg",
    "developers": [
      "Owlcat Games"
    ],
    "display_type": "game",
    "downloads": [],
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "fandesc": null,
    "features": [
      "Steam Achievements",
      "Steam Trading Cards",
      "Steam Cloud",
      "Remote Play on Tablet"
    ],
    "franchises": [
      "Pathfinder Kingmaker"
    ],
    "genres": [
      "RPG"
    ],
    "giveaway": false,
    "hideDiscount": false,
    "img": [
      {
        "order": "99",
        "slug": "41c8fc4f-112d-42ea-8274-e7634d38c262.jpg",
        "alt": "41c8fc4f-112d-42ea-8274-e7634d38c262"
      },
      {
        "order": "99",
        "slug": "3fbd8ef0-a4db-4b69-93a2-3f9a3e84ce9d.jpg",
        "alt": "3fbd8ef0-a4db-4b69-93a2-3f9a3e84ce9d"
      },
      {
        "order": "99",
        "slug": "130de6b9-8b7e-49b5-a8d7-691e87b36840.jpg",
        "alt": "130de6b9-8b7e-49b5-a8d7-691e87b36840"
      },
      {
        "order": "99",
        "slug": "cb2b8455-147a-4a20-9f46-7adaf46aa4df.jpg",
        "alt": "cb2b8455-147a-4a20-9f46-7adaf46aa4df"
      },
      {
        "order": "99",
        "slug": "1fd37f19-116b-4a99-ad81-ceee7c0d95c4.jpg",
        "alt": "1fd37f19-116b-4a99-ad81-ceee7c0d95c4"
      },
      {
        "order": "99",
        "slug": "a9e20aaf-4602-42c6-8b66-31075a4ca156.jpg",
        "alt": "a9e20aaf-4602-42c6-8b66-31075a4ca156"
      },
      {
        "order": "99",
        "slug": "5d9df9fd-dd36-445b-a70e-0eb6e9a1a61e.jpg",
        "alt": "5d9df9fd-dd36-445b-a70e-0eb6e9a1a61e"
      },
      {
        "order": "99",
        "slug": "b5080bec-bd73-4f67-a6b6-78f78c4f06ef.jpg",
        "alt": "b5080bec-bd73-4f67-a6b6-78f78c4f06ef"
      },
      {
        "order": "99",
        "slug": "17572686-76c5-48fa-bfac-15e7f73fd4d7.jpg",
        "alt": "17572686-76c5-48fa-bfac-15e7f73fd4d7"
      },
      {
        "order": "99",
        "slug": "ec73e96c-ca6c-4d2a-a482-ae65d5b4739a.jpg",
        "alt": "ec73e96c-ca6c-4d2a-a482-ae65d5b4739a"
      },
      {
        "order": "99",
        "slug": "07175a68-de47-49a3-8663-bc3fedb03762.jpg",
        "alt": "07175a68-de47-49a3-8663-bc3fedb03762"
      },
      {
        "slug": "4cc817b8-1ba3-4ad9-a511-e764e80d7486.jpg",
        "alt": "4cc817b8-1ba3-4ad9-a511-e764e80d7486"
      }
    ],
    "lang": [
      "English",
      "French",
      "German",
      "Russian",
      "Simplified Chinese"
    ],
    "modes": [
      "Singleplayer"
    ],
    "name": "Pathfinder: Kingmaker - Enhanced Plus Edition",
    "no_release_date": false,
    "no_release_date_text": null,
    "notice": {
      "legal": "Pathfinder and Kingmaker are trademarks and copyrights owned exclusively by Paizo Inc. and used under license. Owlcat Games is a trademark of OWLCAT GAMES LTD. My.com is a trademark of My.com B.V. 2018 published by Deep Silver, a division of Koch Media GmbH, Austria. Deep Silver and its respective logos are trademarks of Koch Media GmbH. This product is based on tools and technologies ©2018, My.com B.V., Owlcat Games. Certain tools and technology also used in this product are © Unity Technologies, 2018, © 2006–2018 Audiokinetic Inc., © 2008-2018 Syrinscape Pty Ltd."
    },
    "platform_specs": {
      "lin": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Ubuntu 14.04 LTS 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Celeron 1037U @ 1.80GHz<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> Intel HD Graphics 3000<br></li><li><strong>Storage:</strong> 30 GB available space</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Ubuntu 14.04 LTS 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Core i7 CPU 920 @ 2.67GHz<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> ATI Radeon HD 5770 or NVIDIA GeForce GTX 960M<br></li><li><strong>Storage:</strong> 30 GB available space</li></ul>"
      },
      "mac": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> OS X El Capitan<br></li><li><strong>Processor:</strong> Intel Core i7-3610QE @ 2.30GHz<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> Intel HD Graphics 4000<br></li><li><strong>Storage:</strong> 30 GB available space</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> OS X El Capitan<br></li><li><strong>Processor:</strong> Intel Core i7-4770HQ @ 2.20GHz<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> Radeon HD 6790 or GeForce GTX 675MX<br></li><li><strong>Storage:</strong> 30 GB available space</li></ul>"
      },
      "win": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows 7 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Celeron 1037U @ 1.80GHz<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> Intel HD Graphics 3000<br></li><li><strong>Storage:</strong> 30 GB available space<br></li><li><strong>Sound Card:</strong> DirectX Compatible Sound Card</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li>Requires a 64-bit processor and operating system<br></li><li><strong>OS:</strong> Windows 7 64-bit or newer<br></li><li><strong>Processor:</strong> Intel Core i7 CPU 920 @ 2.67GHz<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> ATI Radeon HD 5770 or NVIDIA GeForce GTX 960M<br></li><li><strong>Storage:</strong> 30 GB available space<br></li><li><strong>Sound Card:</strong> DirectX Compatible Sound Card</li></ul>"
      }
    },
    "platforms": {
      "linux": true,
      "mac": true,
      "windows": true
    },
    "presale": false,
    "price": {
      "JPY": 205000,
      "RUB": 172800,
      "AUD": 2895,
      "CAD": 2279,
      "EUR": 1999,
      "USD": 1999,
      "GBP": 1599
    },
    "publishers": [
      "Prime Matter"
    ],
    "quotes": [],
    "release": "2020-07-24T07:48:07.638Z",
    "sdesc": "ROW",
    "seo": {
      "desc": "Embark on an adventure in the first isometric RPG set in the Pathfinder universe, with influences from classics of the genre such as Baldur's Gate and Fallout. Get your Steam PC key now!",
      "title": null
    },
    "showReview": true,
    "slug": "pathfinder-kingmaker",
    "steam": {
      "packages": [],
      "dlc": [
        900447,
        900448,
        900449,
        937800,
        965950,
        1041820,
        1209370
      ],
      "release": "2018-09-25T00:00:00.000Z",
      "id": 640820,
      "type": "app"
    },
    "template_type": null,
    "type": "game",
    "ubisoft_ska": false,
    "url": "https://owlcatgames.com/",
    "video": [
      "N9iD9Y5rBIA"
    ],
    "visible": {
      "valid_from": "2018-09-24T23:00:00.000Z",
      "valid_until": null
    },
    "regions_excluded": [],
    "regions_included": [],
    "catalina": true,
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "free_redeem_code": null,
    "bundleCover": null,
    "header": null,
    "desc": "<p>Explore a beloved tabletop universe in video game form with your&#160;Pathfinder: Kingmaker - Enhanced Edition Steam PC key. In this isometric RPG, you'll explore and conquer the Stolen Lands and make them your kingdom - in an adventure inspired by games like Baldur's Gate, Fallout 1 &amp; 2 and Arcanum.</p>&#10;<p><strong>A FAMILIAR SETTING IN A NEW ERA</strong><br/>Explore the Stolen Lands, a region that has been contested territory for centuries. Hundreds of kingdoms have risen and fallen in these lands, and now it is time for you to make your mark by building your own kingdom!</p>&#10;<p>To do so, you&#8217;ll need to survive the harsh wilderness and the threat of rival nation, as well as threats within your own court. Conquer new regions as claim them as your own, carving your kingdom from the wilderness.</p>&#10;<p>While classic dungeon crawling and exploration lie at the heart of this adventure, diplomacy, politics, and kingdom development are also part of the challenge. Choose your allies well, and keep them close while exploring ancient tombs and ruins - and while dealing with politics in your own court.<br/><br/><strong>BUILD YOUR CHARACTER</strong><br/>Customize your character with a wide range of classes and powers including specialized archetypes, powerful arcane and divine spells, choosing from a multitude of class abilities, skills, and feats. Create heroes (or villains) that fit both their individual gameplay styles and their personalities.<br/><br/>Meet a diverse cast of companions and NPCs, including iconic characters from the Pathfinder setting itself. You&#8217;ll need to decide who to trust and who to watch carefully, as each companion has an agenda, alignment, and goals that may differ from yours.</p>&#10;<p>Your journey will become their journey, and you&#8217;ll help shape their lives both in the moment and well into the future.<br/><br/><strong>SHAPE YOUR OWN LEGACY</strong><br/>Your kingdom is a reflection of your character and your choices throughout the game. It is a living thing shaped by your alignment, your allies, and your ability to lead your people.</p>&#10;<p>Not only can your kingdom expand, opening up new territories and allowing you to build new towns and communities, but your capital city will physically change based on your decisions, your policies, and even whom you choose to ally with. As your kingdom grows, a number of factions and neighboring countries will come to you to seek favor - and to test your strength.</p>&#10;<p><strong>EXPLORE, CONQUER, RULE!</strong><br/>Pathfinder is an evolution of the 3.5 rules set of the world's oldest fantasy roleplaying game, designed by Paizo, Inc using the feedback of tens of thousands of gamers just like you. Whether you&#8217;re new to the Pathfinder universe or you're a seasoned veteran, Pathfinder: Kingmaker is the CRPG you&#8217;ve been waiting for.</p>&#10;<p><strong>THRIVING COMMUNITY</strong><br/>With the help of over 18,000 Kickstarter backers,&#160;Owlcat Games' Narrative Designer Chris Avellone and composer Inon Zur bring you the first isometric computer role-playing game set in the Pathfinder tabletop universe.</p>&#10;<p>Based on our players' feedback and suggestions, this version of the game improves and builds upon the original. This edition includes:</p>&#10;<ul>&#10;<li>New items and weaponry.</li>&#10;<li>Increased variety of random encounters on the global map.</li>&#10;<li>New abilities and ways to build your character, including a brand-new class.</li>&#10;<li>Thousands of fixes and improvements made since the game's initial release.</li>&#10;<li>Improved balance, especially in the beginning and last two chapters of the game.</li>&#10;<li>Numerous gameplay-enriching content additions and dozens of quality-of-life features.</li>&#10;<li>Enhanced kingdom management system, both in terms of balance as well as usability and player comfort.</li>&#10;</ul>&#10;<p><strong>YOUR OFFICIAL PATHFINDER: KINGMAKER - ENHANCED EDITION STEAM PC KEY INCLUDES:</strong></p>&#10;<ul>&#10;<li>Epic CRPG action based on the beloved tabletop universe.</li>&#10;<li>Vast character customization for your heroic heroes or villains.</li>&#10;<li>Thousands of fixes and improvements based on community feedback.</li>&#10;<li>Diverse cast of iconic companions and NPCs to meet on your adventures.</li>&#10;</ul>",
    "hitcardVideo": "5vRJ1mnKvyU1R57g0VWZtn6L2MVzk6hJP-480p.mp4",
    "supplier_id": "5e1f1f55d517c700856d5ba1",
    "currentPrice": {
      "JPY": 205000,
      "RUB": 172800,
      "AUD": 2895,
      "CAD": 2279,
      "EUR": 1999,
      "USD": 1999,
      "GBP": 1599
    },
    "current_discount": {
      "percent": 0,
      "display_percentage": false
    },
    "drm_string": "steam",
    "platforms_string": "linux,mac,windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [
      "pathfinder-kingmaker-the-wildcards",
      "pathfinder-kingmaker-beneath-the-stolen-lands",
      "pathfinder-kingmaker-varnhold-s-lot",
      "pathfinder-kingmaker-royal-ascension-dlc",
      "pathfinder-kingmaker-season-pass"
    ],
    "recommendations": [
      "pathfinder-adventures",
      "ni-no-kuni-ii-revenant-kingdom-the-princes-edition",
      "ni-no-kuni-ii-revenant-kingdom",
      "pillars-of-eternity-ii-deadfire",
      "greedfall",
      "tyranny-standard-edition",
      "king-s-bounty-ii-lords-edition",
      "tails-of-iron",
      "house-party",
      "kingdom-rush-origins",
      "endless-legend",
      "planescape-torment-enhanced-edition",
      "kingdom-come-deliverance",
      "baldurs-gate-enhanced-edition",
      "tyranny-deluxe-edition"
    ],
    "recommendations_challenger": [
      "pathfinder-adventures",
      "ni-no-kuni-ii-revenant-kingdom-the-princes-edition",
      "ni-no-kuni-ii-revenant-kingdom",
      "pillars-of-eternity-ii-deadfire",
      "greedfall",
      "tyranny-standard-edition",
      "king-s-bounty-ii-lords-edition",
      "tails-of-iron",
      "house-party",
      "kingdom-rush-origins",
      "endless-legend",
      "planescape-torment-enhanced-edition",
      "kingdom-come-deliverance",
      "baldurs-gate-enhanced-edition",
      "tyranny-deluxe-edition"
    ],
    "reviews": [
      {
        "scoreType": "text",
        "outletName": "GameCrate",
        "message": "\"PC gamers looking for the old time cRPG feeling can't go wrong with Pathfinder: Kingmaker. The presentation is beautiful, the writing is excellent, and the world offers just enough life to engage the player's imagination to fill in the gaps. Still, at the time of this writing, balancing issues and bugs keep the game from being a definite recommend – at least for the time being.\"",
        "url": "http://www.gamecrate.com/reviews/review-pathfinder-kingmaker-beautiful-unstable-game/21101",
        "displayScore": "8.3 / 10",
        "outletImage": "",
        "author": "René S. Garcia Jr."
      },
      {
        "scoreType": "text",
        "outletName": "Wccftech",
        "message": "\"Pathfinder: Kingmaker is a huge game. The depths of its mechanics seem to have no limit while the time spent playing it is equally eternal. With complex rules and stripped back tutorials, though, it is not an easy game to jump into to say the least.\"",
        "url": "https://wccftech.com/review/pathfinder-kingmaker-review-carving-your-own-path/",
        "displayScore": "7.3 / 10",
        "outletImage": "",
        "author": "Rosh Kelly"
      },
      {
        "scoreType": "stars",
        "outletName": "Digitally Downloaded",
        "message": "\"It's a major time commitment, sure, but Pathfinder: Kingmaker has the kind of narrative arc and development that perfectly captures the essence of playing a tabletop RPG, only in digital form.\"",
        "url": "https://www.digitallydownloaded.net/2020/09/review-pathfinder-kingmaker-sony.html",
        "displayScore": "4.5 / 5 stars",
        "outletImage": "",
        "author": "Matt Sainsbury",
        "starScore": 4.5,
        "outOfStarScore": 5
      }
    ],
    "openCriticUrl": "https://opencritic.com/game/6698/pathfinder-kingmaker",
    "opencriticScoreString": "72% Fair",
    "opencriticReviewCount": 37,
    "opencriticPercentRecommended": 38,
    "openCriticScore": 72,
    "videos": [
      {
        "id": "4-vkdMmvyH8",
        "title": "Pathfinder  Kingmaker the end is near",
        "date": "2019-07-03T11:29:27Z",
        "thumbnail_url": "https://i.ytimg.com/vi/4-vkdMmvyH8/hqdefault.jpg"
      },
      {
        "id": "6zbXrIYSqKg",
        "title": "WE GOT AMIRI BACK | Let&#39;s Play Pathfinder Kingmaker (Modded) Ep. 43",
        "date": "2021-05-13T22:00:02Z",
        "thumbnail_url": "https://i.ytimg.com/vi/6zbXrIYSqKg/hqdefault.jpg"
      },
      {
        "id": "A4NxunSUXow",
        "title": "Let&#39;s Play Pathfinder Kingmaker (Modded) Ep. 22",
        "date": "2021-05-03T06:04:22Z",
        "thumbnail_url": "https://i.ytimg.com/vi/A4NxunSUXow/hqdefault.jpg"
      },
      {
        "id": "kdx-WLEDLnA",
        "title": "Let&#39;s Play Pathfinder Kingmaker (Modded) Ep. 16",
        "date": "2021-04-26T06:02:21Z",
        "thumbnail_url": "https://i.ytimg.com/vi/kdx-WLEDLnA/hqdefault.jpg"
      },
      {
        "id": "cwj1BXR18mg",
        "title": "Pathfinder Kingmaker: All About Slayers",
        "date": "2021-03-28T03:33:41Z",
        "thumbnail_url": "https://i.ytimg.com/vi/cwj1BXR18mg/hqdefault.jpg"
      },
      {
        "id": "KQOcwuVKxL0",
        "title": "Pathfinder Kingmaker: All About Duelist",
        "date": "2021-04-12T01:19:51Z",
        "thumbnail_url": "https://i.ytimg.com/vi/KQOcwuVKxL0/hqdefault.jpg"
      },
      {
        "id": "SHaqdJa3FUE",
        "title": "WE GOT GARGLED | Let&#39;s Play Pathfinder Kingmaker (Modded) Ep. 67",
        "date": "2021-06-09T05:36:57Z",
        "thumbnail_url": "https://i.ytimg.com/vi/SHaqdJa3FUE/hqdefault.jpg"
      },
      {
        "id": "GzhS-SqPMdE",
        "title": "Pathfinder Kingmaker - All companion endings",
        "date": "2021-05-25T12:00:06Z",
        "thumbnail_url": "https://i.ytimg.com/vi/GzhS-SqPMdE/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "YSeeCxAAACMA_P8q",
        "uid": "best-pc-games-based-on-board-games",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22YSeeCxAAACMA_P8q%22%29+%5D%5D",
        "tags": [
          "Steam PC",
          "Top picks"
        ],
        "first_publication_date": "2021-08-30T15:00:19+0000",
        "last_publication_date": "2021-09-01T14:08:21+0000",
        "slugs": [
          "the-best-pc-games-based-on-board-games",
          "the-best-games-based-on-board-games-for-pc",
          "the-best-cyberpunk-games-for-pc-gamers"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-08-30T15:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "The best PC games based on board games",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/5871c6dc-e9c9-4614-97f2-a53975c78678_pathfinder2.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/5871c6dc-e9c9-4614-97f2-a53975c78678_pathfinder2.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/5871c6dc-e9c9-4614-97f2-a53975c78678_pathfinder2.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/5871c6dc-e9c9-4614-97f2-a53975c78678_pathfinder2.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Roll the dice, make your moves and enjoy board game inspired video games",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": [
        {
          "_id": "613b62eae5364e1c8390d28f",
          "slug": "pathfinder-kingmaker",
          "rating": 4,
          "display_name": "Tom S.",
          "title": "Instant Favorite.",
          "text": "If you are a fan of classic CRPGs or Pathfinder then you owe it to yourself to play this game. So many classes to choose from and with the addition of turn based mode it is much closer to tabletop experience.  I have started this over so many times just to try different class combos and dialog options.  ",
          "date": "2021-09-10T13:55:18.498Z",
          "staff_review": false,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "5e20327ee5364e1c839c6909",
          "version_id": "613b63c6e3676d00834ef69e",
          "published": true,
          "has_active_version": true,
          "removed": false
        },
        {
          "_id": "613b9e80e5364e1c83a287e7",
          "slug": "pathfinder-kingmaker",
          "rating": 4,
          "display_name": "Downhill Marmot",
          "title": "Excellent RPG",
          "text": "Pathfinder: Kingmaker has everything we've come to expect from PC RPGs; highly customizable characters, detailed plot, lots of side quests, including party-specific quests to build loyalty, and the now-ubiquitous romance opportunity.\n\nThere are a couple of areas to nitpick: the interface is a little clunky and very busy with popup windows often obscuring the map.  Accessing additional information for inventory items is a kludgy two-step process. When involved in large-scale combat, there is a bug that hangs the action. This can be remedied by switching to real-time move and then back again, but I hope it's addressed in the forthcoming sequel.\n\nAll in all, an excellent value and worth the time, but I'd rate it similar but (slightly) inferior to the Pillars of Eternity games, though the Pathfinder setting might give this greater appeal to TTRPG players of that system.",
          "date": "2021-09-10T18:13:11.909Z",
          "staff_review": false,
          "recommended": true,
          "likes": 0,
          "locale": "en",
          "product_id": "5e20327ee5364e1c839c6909",
          "version_id": "613ba037e3676d00834f6a73",
          "published": true,
          "has_active_version": true,
          "removed": false
        }
      ]
    },
    "relatedHits": [
      {
        "product_id": "5e2037d4e5364e1c839d1989",
        "sku": "PCD13944",
        "name": "Pathfinder: Kingmaker - Beneath The Stolen Lands",
        "slug": "pathfinder-kingmaker-beneath-the-stolen-lands",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "7f339b2c-fe74-4da6-8713-796a6bdf9d26.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 5.79,
          "EUR": 7.99,
          "USD": 7.99,
          "CAD": 8.99,
          "AUD": 11.5,
          "RUB": 716,
          "JPY": 820
        },
        "fullPrice": {
          "GBP": 5.79,
          "EUR": 7.99,
          "USD": 7.99,
          "CAD": 8.99,
          "AUD": 11.5,
          "RUB": 716,
          "JPY": 820
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer"
        ],
        "collections": [],
        "video": [
          "X50WD95XZBU"
        ],
        "available_valid_from": 1579132800,
        "available_valid_until": 32535216000,
        "release_date": 1559779200,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "e31ee652-a363-406d-a2a6-71d0209e17ad.png",
          "575245e3-5599-44ea-a14d-6fdc7d238133.png",
          "14517633-c1e9-492f-a6e3-ccd39bf79279.png",
          "275656e8-654b-4777-9b66-aeee12c0ce20.png",
          "67737c16-e026-44d7-ac79-ce1981c4fe34.png",
          "fbb1a633-17d4-408a-85b3-baf8d2800fdf.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 16,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5352028002"
      },
      {
        "product_id": "5e20386be5364e1c839d2e96",
        "sku": "PCD13945",
        "name": "Pathfinder: Kingmaker - Royal Ascension DLC",
        "slug": "pathfinder-kingmaker-royal-ascension-dlc",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "d6df6deb-453a-4760-99a4-2d1bb7c4b8af.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 10.29,
          "EUR": 12.99,
          "USD": 12.99,
          "CAD": 14.49,
          "AUD": 18.5,
          "RUB": 1163,
          "JPY": 1320
        },
        "fullPrice": {
          "GBP": 10.29,
          "EUR": 12.99,
          "USD": 12.99,
          "CAD": 14.49,
          "AUD": 18.5,
          "RUB": 1163,
          "JPY": 1320
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer",
          "Steam trading cards",
          "Steam achievements"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1579132800,
        "available_valid_until": 32535216000,
        "release_date": 1579169792,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "ea720aa4-1b71-4dd9-b67a-0783e3165fe2.png",
          "a5628423-b5d9-4d5a-a250-d04f04424259.png",
          "34acad69-fc2f-491b-a5da-6be7baa86a51.png",
          "c0c901b1-8342-4488-8e0a-9412d49baa7d.png",
          "51183c64-dc6c-4ee6-8f34-d69a401a92c7.png",
          "eb5b1f78-2478-4add-8726-440b7de61937.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ESRB": 0,
          "PEGI": 16,
          "USK": 0,
          "ACB": 0
        },
        "objectID": "5352029002"
      },
      {
        "product_id": "5e2035b6e5364e1c839cd3c8",
        "sku": "PCD13942",
        "name": "Pathfinder: Kingmaker - The Wildcards",
        "slug": "pathfinder-kingmaker-the-wildcards",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "7396e8d2-38fe-4e69-8e82-2059edefd4e9.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 4.79,
          "EUR": 5.99,
          "USD": 5.99,
          "CAD": 6.69,
          "AUD": 8.5,
          "RUB": 533,
          "JPY": 620
        },
        "fullPrice": {
          "GBP": 4.79,
          "EUR": 5.99,
          "USD": 5.99,
          "CAD": 6.69,
          "AUD": 8.5,
          "RUB": 533,
          "JPY": 620
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer"
        ],
        "collections": [],
        "video": [
          "89uYP36UVu4"
        ],
        "available_valid_from": 1579132800,
        "available_valid_until": 32535216000,
        "release_date": 1544745600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "5bce8c11-c145-41f4-a4bf-caf9cb423342.png",
          "330a28c9-9e1e-4931-a9f0-2784d4483eb2.png",
          "271c685c-4ce3-49f3-9741-c98d3c2a3dbf.png",
          "641d84b2-2a18-4da8-90ee-29050a7f51c8.png",
          "16e8546d-3f18-4195-8823-738e01cbd63c.png",
          "b652a8cc-dd0a-435a-94b6-f8e7332d8ad1.png"
        ],
        "video_clip_files": [
          {
            "fileType": "mp4",
            "resolution": "480p",
            "path": "4yDk7QQR1lIxrKmwY5xGiP22677PzksOjk-480p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "480p",
            "path": "4yDk7QQR1lIxrKmwY5xGiP22677PzksOjk-480p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "360p",
            "path": "4yDk7QQR1lIxrKmwY5xGiP22677PzksOjk-360p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "360p",
            "path": "4yDk7QQR1lIxrKmwY5xGiP22677PzksOjk-360p.webm"
          },
          {
            "fileType": "mp4",
            "resolution": "240p",
            "path": "4yDk7QQR1lIxrKmwY5xGiP22677PzksOjk-240p.mp4"
          },
          {
            "fileType": "webm",
            "resolution": "240p",
            "path": "4yDk7QQR1lIxrKmwY5xGiP22677PzksOjk-240p.webm"
          }
        ],
        "video_clip_poster": "4yDk7QQR1lIxrKmwY5xGiP22677PzksOjk-poster.jpg",
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 16,
          "ESRB": 0
        },
        "objectID": "5352026002"
      },
      {
        "product_id": "5e2036e6e5364e1c839cf9aa",
        "sku": "PCD13943",
        "name": "Pathfinder: Kingmaker - Varnhold's Lot",
        "slug": "pathfinder-kingmaker-varnhold-s-lot",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "72162960-ff08-4f42-9b38-0a9ff943c9b7.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 6.19,
          "EUR": 8.99,
          "USD": 8.99,
          "CAD": 10.29,
          "AUD": 12.95,
          "RUB": 801,
          "JPY": 930
        },
        "fullPrice": {
          "GBP": 6.19,
          "EUR": 8.99,
          "USD": 8.99,
          "CAD": 10.29,
          "AUD": 12.95,
          "RUB": 801,
          "JPY": 930
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer"
        ],
        "collections": [],
        "video": [
          "WUzEurNUMgw"
        ],
        "available_valid_from": 1579132800,
        "available_valid_until": 32535216000,
        "release_date": 1551312000,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "9914b8b1-6484-4f37-856c-4daa253c6444.png",
          "0c8e940a-f809-4062-9814-011d07e0f195.png",
          "f489dd36-3255-4a8a-a2bf-3e73681583c4.png",
          "01cd08f6-388f-4977-8ed8-8d23077492ca.png",
          "cae29d79-ed85-46a2-906f-2b69fe4237ec.png",
          "28ad2dc5-97da-41c6-bdd9-92ef45b343e4.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 16,
          "ESRB": 0
        },
        "objectID": "5352027002"
      },
      {
        "product_id": "5e203506e5364e1c839cbdb3",
        "sku": "PCD13941",
        "name": "Pathfinder: Kingmaker - Season Pass",
        "slug": "pathfinder-kingmaker-season-pass",
        "type": "dlc",
        "display_type": "dlc",
        "cover": "c995808d-70b4-4a10-bb46-dfaceeef7ef5.jpeg",
        "tiered": false,
        "discount_percent": 0,
        "best_ever": false,
        "flash_sale": false,
        "price": {
          "GBP": 22.38,
          "EUR": 24.87,
          "USD": 24.87,
          "CAD": 29.44,
          "AUD": 35.64,
          "RUB": 1808,
          "JPY": 2531
        },
        "fullPrice": {
          "GBP": 22.38,
          "EUR": 24.87,
          "USD": 24.87,
          "CAD": 29.44,
          "AUD": 35.64,
          "RUB": 1808,
          "JPY": 2531
        },
        "operating_systems": [
          "linux",
          "mac",
          "windows"
        ],
        "drm": [
          "steam"
        ],
        "features": [
          "Singleplayer"
        ],
        "collections": [],
        "video": [],
        "available_valid_from": 1579132800,
        "available_valid_until": 32535216000,
        "release_date": 1537833600,
        "presale": false,
        "hide_discount": false,
        "hide_price": false,
        "giveaway": false,
        "ubisoft_ska": false,
        "epic_ska": false,
        "origin_ska": false,
        "no_release_date": false,
        "free_to_play": false,
        "mystery": false,
        "pay_what_you_want": false,
        "game_total": 0,
        "dlc_total": 0,
        "bundle_covers": [],
        "screenshots": [
          "b94dc6d8-ba12-4088-9739-7880a03d2048.png",
          "dd217062-0102-474e-a0f1-be50cccc6c7d.png",
          "ea31c128-e408-48c7-9255-bcd9bd99f53c.png",
          "537cbb32-af9d-454c-973b-129e0c7abeee.png",
          "5baac2c8-fb2d-4630-8261-dd8ed41d1f36.png",
          "349f54d7-af7e-47c4-9d67-13afb5df1c1f.png"
        ],
        "video_clip_files": [],
        "video_clip_poster": 0,
        "age_ratings": {
          "ACB": 0,
          "USK": 0,
          "PEGI": 16,
          "ESRB": 0
        },
        "objectID": "5352025002"
      }
    ],
    "userReviewSummary": {
      "rating_score": 3.8,
      "total_ratings": 4,
      "percent_recommended": 100,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 25,
        "four_star_percentage": 75,
        "five_star_percentage": 0
      },
      "reviewLocales": [
        "en"
      ],
      "total_written_reviews": 2
    }
  },
  {
    "_id": "598036c3789c68307354fb01",
    "release": "2017-12-08T09:07:31.082Z",
    "quotes": [],
    "seo": {
      "desc": "Sneak into your neighbor's house in this Stealth Horror Game and figure out what he's hiding in the basement. With his advanced AI, will you make it out alive?",
      "title": null
    },
    "notice": {
      "legal": null
    },
    "age": {
      "ACB": 0,
      "USK": 0,
      "PEGI": 0,
      "ESRB": 0
    },
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 309000,
      "RUB": 189900,
      "AUD": 4099,
      "CAD": 3399,
      "EUR": 2799,
      "USD": 2999,
      "GBP": 2379
    },
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2017-12-08T00:00:00.000Z",
      "id": 521890,
      "type": "app"
    },
    "lang": [
      "English"
    ],
    "genres": [
      "Adventure",
      "Indie",
      "Strategy"
    ],
    "publishers": [
      "tinyBuild"
    ],
    "developers": [
      "Dynamic Pixels"
    ],
    "features": [
      "Steam Achievements",
      "Full controller support"
    ],
    "modes": [
      "Singleplayer"
    ],
    "video": [
      "zYHm59lDpMI",
      "O41H9yESyHA"
    ],
    "regions_excluded": [],
    "regions_included": [],
    "availability": {
      "valid_until": null,
      "valid_from": "2017-07-31T23:00:00.000Z"
    },
    "visible": {
      "valid_until": null,
      "valid_from": "2017-07-31T23:00:00.000Z"
    },
    "platform_specs": {
      "win": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows 7 and up<br></li><li><strong>Processor:</strong> i5 and up<br></li><li><strong>Memory:</strong> 6 GB RAM<br></li><li><strong>Graphics:</strong> GTX 770 and up<br></li><li><strong>Storage:</strong> 2 GB available space<br></li><li><strong>Sound Card:</strong> Stereo. Play with good stereo.</li></ul>"
      }
    },
    "img": [
      {
        "order": "99",
        "slug": "64accfd6-e7cb-46df-9a5a-5b260d2d0eeb.jpg",
        "alt": "64accfd6-e7cb-46df-9a5a-5b260d2d0eeb"
      },
      {
        "order": "99",
        "slug": "0c2fca8c-7664-481e-b84e-288c7660011c.jpg",
        "alt": "0c2fca8c-7664-481e-b84e-288c7660011c"
      },
      {
        "order": "99",
        "slug": "2029e151-007c-4dd4-ab9b-e5dcf0fd08df.jpg",
        "alt": "2029e151-007c-4dd4-ab9b-e5dcf0fd08df"
      },
      {
        "order": "99",
        "slug": "fc9156cd-f8a9-4b44-afda-308a8f70655b.jpg",
        "alt": "fc9156cd-f8a9-4b44-afda-308a8f70655b"
      },
      {
        "order": "99",
        "slug": "a9a709fe-3435-4369-bffa-c1857d3b2111.jpg",
        "alt": "a9a709fe-3435-4369-bffa-c1857d3b2111"
      },
      {
        "slug": "893b11b2-c743-41ff-a414-ef0b405f725e.jpg",
        "alt": "893b11b2-c743-41ff-a414-ef0b405f725e"
      }
    ],
    "bundles": [],
    "hideDiscount": false,
    "presale": false,
    "archive": false,
    "desc": "<p><br/>Hello Neighbor is a stealth horror game about sneaking into your neighbor's house to figure out what horrible secrets he's hiding in the basement. You play against an advanced AI that learns from your every move. Really enjoying climbing through that backyard window? Expect a bear trap there. Sneaking through the front door? There'll be cameras there soon. Trying to escape? The Neighbor will find a shortcut and catch you. <br/><br/></p>&#10;<ul class=\"bb_ul\">&#10;<li>Suspenseful horror gameplay (not jump scares) that focuses on sneaking around your neighbor's house</li>&#10;<li>Constantly evolving experience where the Neighbor's AI counters your moves, and learns from what you do</li>&#10;<li>Sandbox-style gameplay with plenty of environmental interaction and physics</li>&#10;</ul>",
    "sdesc": null,
    "cover": "44241a59-327c-42bb-807f-1046c87c59a8.jpg",
    "url": "http://helloneighborgame.com",
    "slug": "hello-neighbor",
    "name": "Hello Neighbor",
    "display_type": "game",
    "type": "game",
    "collections": [
      "EMAIL COUPON JULY 2020"
    ],
    "fandesc": null,
    "giveaway": false,
    "ubisoft_ska": false,
    "franchises": [
      "Hello Neighbor"
    ],
    "fullPrice": {
      "CAD": 3399,
      "USD": 2999,
      "EUR": 2799,
      "GBP": 2379,
      "AUD": 4099
    },
    "__v": 202,
    "template_type": "standard",
    "no_release_date": false,
    "no_release_date_text": null,
    "free_to_play": false,
    "free_to_play_url": null,
    "artists": [],
    "authors": [],
    "downloads": [],
    "showReview": true,
    "free_redeem_code": null,
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "hitcardVideo": "yg4R6QlD0Wtqpn41137xfRA6qYvjR-480p.mp4",
    "supplier_id": "55db244ad3b050fe108b45e2",
    "currentPrice": {
      "JPY": 227115,
      "RUB": 139576,
      "AUD": 3012,
      "CAD": 2498,
      "EUR": 2057,
      "USD": 2204,
      "GBP": 1748
    },
    "current_discount": {
      "percent": 0.265,
      "display_percentage": true,
      "until": "2021-09-22T15:59:00.000Z",
      "from": "2021-09-20T07:01:00.792Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": true,
      "highlighted": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "recommendations": [
      "secret-neighbor",
      "hello-neighbor-hide-and-seek",
      "neighbours-back-from-hell",
      "dead-by-daylight",
      "emily-wants-to-play",
      "resident-evil-7-biohazard",
      "horror-story-hallowseed",
      "home-sweet-home",
      "metro-last-light-redux",
      "resident-evil-2-biohazard-re-2",
      "little-nightmares-complete-edition",
      "layers-of-fear",
      "hitman-game-of-the-year-edition",
      "metro-2033-redux",
      "the-evil-within-2"
    ],
    "recommendations_challenger": [
      "secret-neighbor",
      "hello-neighbor-hide-and-seek",
      "neighbours-back-from-hell",
      "dead-by-daylight",
      "emily-wants-to-play",
      "resident-evil-7-biohazard",
      "horror-story-hallowseed",
      "home-sweet-home",
      "metro-last-light-redux",
      "resident-evil-2-biohazard-re-2",
      "little-nightmares-complete-edition",
      "layers-of-fear",
      "hitman-game-of-the-year-edition",
      "metro-2033-redux",
      "the-evil-within-2"
    ],
    "videos": [
      {
        "id": "UI3eezYRHSM",
        "title": "Funny moments in Hello Neighbor || Experiments with Neighbor 04",
        "date": "2021-09-17T09:25:42Z",
        "thumbnail_url": "https://i.ytimg.com/vi/UI3eezYRHSM/hqdefault.jpg"
      },
      {
        "id": "oBu7jGrIrJ8",
        "title": "Funny moments in Hello Neighbor || Experiments with Neighbor 03",
        "date": "2021-09-15T09:25:24Z",
        "thumbnail_url": "https://i.ytimg.com/vi/oBu7jGrIrJ8/hqdefault.jpg"
      },
      {
        "id": "3WQWyLqmdZk",
        "title": "Hello Neighbor Game for kids with Jason and Sara",
        "date": "2021-05-23T19:18:08Z",
        "thumbnail_url": "https://i.ytimg.com/vi/3WQWyLqmdZk/hqdefault.jpg"
      },
      {
        "id": "4bD4azbFdOg",
        "title": "Hello Neighbor in Granny Horror Game! (Hello Neighbor Granny Mobile Horror Game Mod)",
        "date": "2018-09-26T04:00:00Z",
        "thumbnail_url": "https://i.ytimg.com/vi/4bD4azbFdOg/hqdefault.jpg"
      },
      {
        "id": "neYZuuH_5FQ",
        "title": "Jason plays with pretend play hello neighbor game",
        "date": "2021-04-27T06:30:08Z",
        "thumbnail_url": "https://i.ytimg.com/vi/neYZuuH_5FQ/hqdefault.jpg"
      },
      {
        "id": "6YoE3PyJsvU",
        "title": "Hello Neighbor Game with Jason And Sara Fun Game",
        "date": "2021-05-15T14:00:02Z",
        "thumbnail_url": "https://i.ytimg.com/vi/6YoE3PyJsvU/hqdefault.jpg"
      },
      {
        "id": "hTv4MK2K7Dg",
        "title": "Hello Granny!! Granny and Hello Neighbor Horror Game In Real Life (FUNHouse Family)",
        "date": "2019-07-27T12:15:00Z",
        "thumbnail_url": "https://i.ytimg.com/vi/hTv4MK2K7Dg/hqdefault.jpg"
      },
      {
        "id": "Jx6ONfER7yY",
        "title": "THE REAL ENDING DISCOVERED! NEW UPDATE! (Hello Neighbor)",
        "date": "2016-11-23T22:33:45Z",
        "thumbnail_url": "https://i.ytimg.com/vi/Jx6ONfER7yY/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "XRDLpxEAACEApVxQ",
        "uid": "over-1000-sizzling-steam-deals-now-live-in-the-red-hot-sale",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22XRDLpxEAACEApVxQ%22%29+%5D%5D",
        "tags": [
          "Steam PC",
          "Red Hot Sale",
          "Fanatical",
          "AAA",
          "Indie"
        ],
        "first_publication_date": "2019-06-24T15:00:41+0000",
        "last_publication_date": "2020-04-02T14:43:00+0000",
        "slugs": [
          "over-1800-sizzling-steam-deals-now-live-in-the-red-hot-sale",
          "over-1000-sizzling-steam-deals-now-live-in-the-red-hot-sale"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2019-06-27T11:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Over 1,800 sizzling Steam deals now live in the Red Hot Sale",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/ecfa117ddd2fdd9a859b270b1875b9c44f7640c4_blog-image.jpg?auto=compress,format",
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/7dc8db686f744c48726915f4a9635b9271f162b4_blog-image.jpg?auto=compress,format"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/b0f22a4942d9e4c33ca87feaeba423164e3d29f9_blog-image.jpg?auto=compress,format"
            },
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/465cf7659a5c87b14491b8c9809c9941d7a682b6_blog-image.jpg?auto=compress,format"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Sizzling deals on AAA & Indie Steam games",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "W6s_axIAABByGOt0",
        "uid": "10-great-steam-pc-games-in-the-martian-mystery-bundles",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22W6s_axIAABByGOt0%22%29+%5D%5D",
        "tags": [
          "Martian Mystery Bundle",
          "Dying Light",
          ">observer_",
          "Graveyard Keeper",
          "Frostpunk",
          "Moonlighter",
          "Railway Empire",
          "Hello Neighbor",
          "Call of Juarez",
          "House Party",
          "Shadows: Awakening"
        ],
        "first_publication_date": "2018-09-26T13:38:13+0000",
        "last_publication_date": "2018-09-26T15:57:58+0000",
        "slugs": [
          "10-great-steam-games-featured-in-the-martian-mystery-bundles",
          "10-great-steam-games-in-the-martian-mystery-bundles"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2018-09-26T13:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "10 great Steam games featured in the Martian Mystery Bundles",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/846a038fc72e59b67d0e74f827eb3540a8fc506c_martianmysterybundle-blog.jpg?auto=compress,format",
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/39bf0448703a8cc42c4f51f797fb3b02240ceb33_martianmysterybundle-blog.jpg?auto=compress,format"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/0d8893bfd156c2362e8de446336f549cf76f7f61_martianmysterybundle-blog.jpg?auto=compress,format"
            },
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/62acdad5169c67e2f23f1fa95c079cd300071084_martianmysterybundle-blog.jpg?auto=compress,format"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Gamers could get a number of these games in their randomly selected bundles",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {}
  },
  {
    "_id": "6139d8f77830d9007d57791a",
    "__v": 3,
    "age": {
      "ESRB": 6,
      "PEGI": 0,
      "USK": 0,
      "ACB": 6
    },
    "artists": [],
    "authors": [],
    "availability": {
      "valid_from": "2021-09-10T04:00:00.000Z",
      "valid_until": null
    },
    "bundles": [],
    "collections": [],
    "cover": "c6c6ece8-a74c-4f5f-ac85-f4e678388bc0.jpeg",
    "developers": [
      "Visual Concepts"
    ],
    "display_type": "game",
    "downloads": [],
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "features": [
      "PvP",
      "Online PvP",
      "SharedSplit Screen PvP",
      "Online Coop",
      "SharedSplit Screen Coop",
      "SharedSplit Screen",
      "Steam Achievements",
      "Full controller support",
      "InApp Purchases",
      "Steam Cloud",
      "Remote Play on Tablet",
      "Remote Play Together"
    ],
    "franchises": [
      "NBA"
    ],
    "free_redeem_code": null,
    "genres": [
      "Simulation",
      "Sports"
    ],
    "img": [
      {
        "alt": "NBA2K22_FirstLook_Candace.png",
        "slug": "380100c2-1685-47d3-a9e1-a1dd9e6bd067.png",
        "order": "99"
      },
      {
        "alt": "NBA2K22_FirstLook_Dirk.png",
        "slug": "cfa1743e-87c6-4892-9ee6-15688e340c50.png",
        "order": "99"
      },
      {
        "alt": "NBA2K22_FirstLook_Luka.png",
        "slug": "18a9ee20-f5fb-4168-87d3-5eb8e6dc5179.png",
        "order": "99"
      },
      {
        "alt": "NBA2K22_FirstLook_Rui.png",
        "slug": "c34c9d0b-cb92-41ad-a660-58fe729e124c.png"
      }
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "Spanish - Spain",
      "Japanese",
      "Korean",
      "Simplified Chinese",
      "Traditional Chinese",
      "German"
    ],
    "modes": [
      "Singleplayer",
      "Multiplayer",
      "Coop"
    ],
    "name": "NBA 2K22: NBA 75th Anniversary Edition",
    "notice": {
      "legal": "© 2005-2021 Take-Two Interactive Software, Inc. and its subsidiaries. 2K, the 2K logo, and Take-Two Interactive Software are all trademarks and/or registered trademarks of Take-Two Interactive Software, Inc. The NBA and NBA member team identifications are the intellectual property of NBA Properties, Inc. and the respective NBA member teams. © 2021 NBA Properties, Inc. All Rights Reserved. Officially licensed product of the National Basketball Players Association. All other trademarks are property of their respective owners."
    },
    "platform_specs": {
      "win": {
        "min": "Minimum:<br />\nOS: Windows 7 64-bit, Windows 8.1 64-bit or Windows 10 64-bit<br />\nProcessor: Intel® Core™ i3-2100 @ 3.10 GHz / AMD FX-4100 @ 3.60 GHz or better<br />\nMemory: 4 GB RAM<br />\nGraphics: NVIDIA® GeForce® GT 450 1GB / ATI® Radeon™ HD 7770 1GB or better<br />\nDirectX: Version 11<br />\nNetwork: Broadband Internet Connection<br />\nStorage: 110 GB available space<br />\nSound Card: DirectX 9.0x compatible<br />\nDual-Analog Gamepad: Recommended<br />\nAdditional Notes: Initial installation requires one-time internet connection for Steam authentication; software installations required (included with the game) include DirectX and Visual C   Redistributable 2012.<br />",
        "rec": "Recommended<br />\nOS: Windows 7 64-bit, Windows 8.1 64-bit or Windows 10 64-bit<br />\nProcessor: Intel® Core™ i5-4430 @ 3 GHz / AMD FX-8370 @ 3.4 GHz or better<br />\nMemory: 8 GB RAM<br />\nGraphics: NVIDIA® GeForce® GTX 770 2GB / ATI® Radeon™ R9 270 2GB or better<br />\nDirectX: Version 11<br />\nNetwork: Broadband Internet Connection<br />\nStorage: 110 GB available space<br />\nSound Card: DirectX 9.0c compatible sound card<br />\nAdditional Notes: Initial installation requires one-time internet connection for Steam authentication; software installations required (included with the game) include DirectX and Visual C   Redistributable 2012.<br />"
      }
    },
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 1408000,
      "RUB": 874500,
      "AUD": 14995,
      "CAD": 11999,
      "EUR": 9999,
      "USD": 9999,
      "GBP": 8499
    },
    "publishers": [
      "2K Games"
    ],
    "quotes": [],
    "regions_excluded": [],
    "regions_included": [
      {
        "name": "Andorra",
        "code": "AD",
        "_id": "6139d90a9b9b650076abc269"
      },
      {
        "name": "Austria",
        "code": "AT",
        "_id": "6139d90a9b9b650076abc268"
      },
      {
        "name": "Bosnia and Herzegovina",
        "code": "BA",
        "_id": "6139d90a9b9b650076abc267"
      },
      {
        "name": "Bulgaria",
        "code": "BG",
        "_id": "6139d90a9b9b650076abc266"
      },
      {
        "name": "Croatia",
        "code": "HR",
        "_id": "6139d90a9b9b650076abc265"
      },
      {
        "name": "Cyprus",
        "code": "CY",
        "_id": "6139d90a9b9b650076abc264"
      },
      {
        "name": "Czech Republic",
        "code": "CZ",
        "_id": "6139d90a9b9b650076abc263"
      },
      {
        "name": "Denmark",
        "code": "DK",
        "_id": "6139d90a9b9b650076abc262"
      },
      {
        "name": "Estonia",
        "code": "EE",
        "_id": "6139d90a9b9b650076abc261"
      },
      {
        "name": "Faroe Islands",
        "code": "FO",
        "_id": "6139d90a9b9b650076abc260"
      },
      {
        "name": "Finland",
        "code": "FI",
        "_id": "6139d90a9b9b650076abc25f"
      },
      {
        "name": "France",
        "code": "FR",
        "_id": "6139d90a9b9b650076abc25e"
      },
      {
        "name": "Germany",
        "code": "DE",
        "_id": "6139d90a9b9b650076abc25d"
      },
      {
        "name": "Gibraltar",
        "code": "GI",
        "_id": "6139d90a9b9b650076abc25c"
      },
      {
        "name": "Greece",
        "code": "GR",
        "_id": "6139d90a9b9b650076abc25b"
      },
      {
        "name": "Holy See (Vatican City State)",
        "code": "VA",
        "_id": "6139d90a9b9b650076abc25a"
      },
      {
        "name": "Hungary",
        "code": "HU",
        "_id": "6139d90a9b9b650076abc259"
      },
      {
        "name": "Iceland",
        "code": "IS",
        "_id": "6139d90a9b9b650076abc258"
      },
      {
        "name": "Ireland",
        "code": "IE",
        "_id": "6139d90a9b9b650076abc257"
      },
      {
        "name": "Isle of Man",
        "code": "IM",
        "_id": "6139d90a9b9b650076abc256"
      },
      {
        "name": "Italy",
        "code": "IT",
        "_id": "6139d90a9b9b650076abc255"
      },
      {
        "name": "Latvia",
        "code": "LV",
        "_id": "6139d90a9b9b650076abc254"
      },
      {
        "name": "Liechtenstein",
        "code": "LI",
        "_id": "6139d90a9b9b650076abc253"
      },
      {
        "name": "Lithuania",
        "code": "LT",
        "_id": "6139d90a9b9b650076abc252"
      },
      {
        "name": "Macedonia, the Former Yugoslav Republic of",
        "code": "MK",
        "_id": "6139d90a9b9b650076abc251"
      },
      {
        "name": "Malta",
        "code": "MT",
        "_id": "6139d90a9b9b650076abc250"
      },
      {
        "name": "Moldova, Republic of",
        "code": "MD",
        "_id": "6139d90a9b9b650076abc24f"
      },
      {
        "name": "Monaco",
        "code": "MC",
        "_id": "6139d90a9b9b650076abc24e"
      },
      {
        "name": "Montenegro",
        "code": "ME",
        "_id": "6139d90a9b9b650076abc24d"
      },
      {
        "name": "Norway",
        "code": "NO",
        "_id": "6139d90a9b9b650076abc24c"
      },
      {
        "name": "Poland",
        "code": "PL",
        "_id": "6139d90a9b9b650076abc24b"
      },
      {
        "name": "Portugal",
        "code": "PT",
        "_id": "6139d90a9b9b650076abc24a"
      },
      {
        "name": "Romania",
        "code": "RO",
        "_id": "6139d90a9b9b650076abc249"
      },
      {
        "name": "San Marino",
        "code": "SM",
        "_id": "6139d90a9b9b650076abc248"
      },
      {
        "name": "Serbia",
        "code": "RS",
        "_id": "6139d90a9b9b650076abc247"
      },
      {
        "name": "Slovakia",
        "code": "SK",
        "_id": "6139d90a9b9b650076abc246"
      },
      {
        "name": "Spain",
        "code": "ES",
        "_id": "6139d90a9b9b650076abc245"
      },
      {
        "name": "Sweden",
        "code": "SE",
        "_id": "6139d90a9b9b650076abc244"
      },
      {
        "name": "Switzerland",
        "code": "CH",
        "_id": "6139d90a9b9b650076abc243"
      },
      {
        "name": "United Kingdom",
        "code": "GB",
        "_id": "6139d90a9b9b650076abc242"
      }
    ],
    "release": "2021-07-15T09:57:25.103Z",
    "seo": {
      "desc": "NBA 2K22: NBA 75th Anniversary Edition puts the entire basketball universe in your hands. PLAY NOW in real NBA and WNBA environments against authentic teams and players.",
      "title": null
    },
    "showReview": true,
    "slug": "nba-2-k-22-nba-75-th-anniversary-edition",
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2021-09-10T04:00:00.000Z",
      "id": 1644960,
      "type": "app"
    },
    "template_type": "standard",
    "type": "game",
    "url": "https://www.nba2k.com/",
    "video": [
      "on-K3PeG0UY"
    ],
    "visible": {
      "valid_from": "2021-09-10T04:00:00.000Z",
      "valid_until": null
    },
    "desc": "<p>NBA 2K22 puts the entire basketball universe in your hands. PLAY NOW in real NBA and WNBA environments against authentic teams and players. Build your own dream team in MyTEAM with today&#8217;s stars and yesterday&#8217;s legends. Live out your own pro journey in MyCAREER and experience your personal rise to the NBA. Flex your management skills as a powerful Executive in MyGM and MyLEAGUE. Anyone, anywhere can hoop in NBA 2K22.</p>&#10;<p>The NBA 2K22 NBA 75th Anniversary Edition includes:</p>&#10;<ul>&#10;<li>100K VC</li>&#10;<li>10K MyTEAM Points</li>&#10;<li>10 MyTEAM Tokens</li>&#10;<li>Sapphire Kareem Abdul-Jabbar, Dirk Nowitzki, and Kevin Durant MyTEAM Cards</li>&#10;<li>22 MyTEAM Promo Packs (Receive 10 at launch, then 3 per week for 4 weeks)</li>&#10;<li>Diamond Jordan Shoe MyTEAM card</li>&#10;<li>Coach Card MyTEAM Pack</li>&#10;<li>10 Boosts for each MyCAREER Skill Boost type</li>&#10;<li>10 Boosts for each Gatorade Boost type</li>&#10;<li>4 Cover Athlete T-Shirts for your MyPLAYER</li>&#10;<li>MyPLAYER backpack and arm sleeve</li>&#10;<li>Custom-design skateboard for MyPLAYER</li>&#10;</ul>&#10;<p><strong>STEP YOUR GAME UP</strong>&#160;&#8211; New tactical offense meets an overhauled defense for a more competitive and immersive NBA 2K22. Add skill-based dribbling, shooting, dunking, and alley-oops to your bag of moves, and counter them with ferocious new blocks and contests on the other end of the court.</p>&#10;<p><strong>ALL ABOARD THE CRUISE</strong>&#160;&#8211; Set sail for the high seas in the all-new 2K22 Neighborhood, made for PlayStation&#174;4, Xbox One, Nintendo Switch, and PC. Create your perfect MyPLAYER, level up for rewards, and express yourself through both your game and your style.&#34;</p>&#10;<p><strong>YOUR DREAM TEAM</strong>&#160;&#8211; Collect, craft, and hoop in the ultimate NBA fantasy competition: NBA 2K22 MyTEAM. Build your dream lineup of NBA stars and legends across any era, and explore game-changing evolutions to the MyTEAM experience &#8211; each addition introduced Season after Season.</p>&#10;<p><strong>NEW SEASONS, NEW DISCOVERIES</strong>&#160;&#8211; In NBA 2K22, every Season brings fresh opportunities to reap new rewards. Whether in MyTEAM or MyCAREER, compete against the best and discover what amazing rewards each new Season has in store.</p>&#10;<p><strong>Key Features</strong></p>&#10;<p><strong>GET IN THE REAL GAME</strong>&#160;- Play as your favorite NBA and WNBA teams and stars, and experience the authenticity of professional basketball at the highest levels. With best-in-class visual presentation and player AI, up-to-date rosters and historic teams, and much more, the game has never felt more real and complete than it does in NBA 2K. Feel the energy of the crowd, the intensity of the competition, and the endless entertainment of one of the most immersive sports product in gaming today.</p>&#10;<p><strong>PURSUE YOUR PRO DREAM</strong>&#160;- Step into the shoes of an aspiring baller in MyCAREER, and carve your own path to the National Basketball Association in a Hollywood-esque hooper&#8217;s journey. Meet off-the-court friends and on-the-court foes, as your rise to the top takes different twists and turns - some based on the decisions you make for yourself. Will you make your name in College or develop your game professionally in the NBA G League - or both? Or will you confidently take your game directly to the NBA? It&#8217;s entirely your story.</p>&#10;<p><strong>BE PART OF A HUGE HOOPS COMMUNITY</strong>&#160;- Whether in the City (for PlayStation&#9415;5 and Xbox Series X|S) or in the Neighborhood (for PlayStation&#9415;4, Xbox One, Nintendo Switch, and PC), live out your basketball life in the biggest and most vibrant hoops community in the world. With your MyPLAYER, put in the work, rep up, and dominate the courts. You can train in the Gatorade Training Facility, pick up the latest gear at SWAG&#8217;S, and compete throughout the year in diverse Events. Be the baller you want to be in NBA 2K&#8217;s own basketball hub.</p>&#10;<p><strong>BUILD YOUR OWN DREAM TEAM</strong>&#160;- Create the ultimate fantasy roster of today&#8217;s NBA stars and yesterday&#8217;s legends in MyTEAM. An ever-rewarding experience of collection and competition, MyTEAM combines the excitement of discovering and obtaining your favorite player cards and the intensity of taking on the best rosters the MyTEAM community has to offer. Play, earn, craft, and compete through challenges, tournaments, and much more.</p>&#10;<p><strong>TAKE CONTROL OVER EVERYTHING</strong>&#160;- Take control as General Manager - or oversee the entire league from the very top as Commissioner - in the most comprehensive management simulation experience: MyNBA and MyWNBA (MyGM and MyLEAGUE for PlayStation&#9415;4, Xbox One, Nintendo Switch, and PC). Make team, personnel, and other big-time decisions that will determine the success of a team on its way to a dynasty, and experiment with new rules, competition formats, and other league-wide decisions that will shape the sport in remarkable ways.</p>&#10;<p><strong>EXPERIENCE THE LATEST AND GREATEST</strong>&#160;- There&#8217;s always something new to come back to in NBA 2K: the latest NBA/WNBA rosters and Player Ratings, new Challenges and player cards in MyTEAM, the freshest gear and basketball Events in the City/Neighborhood, and much more. With ever-expanding content and one of the most passionate hoops communities, basketball never stops in NBA 2K.</p>&#10;<p><strong>EVERYTHING IS GAME</strong>&#160;- The NBA 2K experience offers more than just the sport of basketball; it is hoops culture and everything around it. Discover up-and-coming music artists in an ever-expanding 2K Beats game soundtrack. Flaunt the latest trends in streetwear and hoops fashion with your MyPLAYER. Design your own sneakers, uniforms, and branding for your custom teams. In NBA 2K, Everything is Game.</p>",
    "genba_id": "89968737-22e8-461f-9589-3f99a7fc06ff",
    "parent_slug": "nba-2-k-22",
    "supplier_id": "57b703b8039e930e00a21cd9",
    "currentPrice": {
      "JPY": 1224960,
      "RUB": 760815,
      "AUD": 13045,
      "CAD": 10439,
      "EUR": 8699,
      "USD": 8699,
      "GBP": 7394
    },
    "current_discount": {
      "percent": 0.13,
      "display_percentage": true,
      "until": "2021-09-21T15:59:00.000Z",
      "from": "2021-09-19T07:01:00.464Z",
      "best_ever": false,
      "flash_sale": false,
      "hide_timer": true,
      "highlighted": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [
      {
        "bundles": [],
        "cover": "a3a8da9e-e15d-46e9-b722-45960d6c5f78.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "NBA 2K22",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 660000,
          "RUB": 524600,
          "AUD": 8995,
          "CAD": 7999,
          "EUR": 5999,
          "USD": 5999,
          "GBP": 4999
        },
        "slug": "nba-2-k-22",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 574200,
          "RUB": 456402,
          "AUD": 7825,
          "CAD": 6959,
          "EUR": 5219,
          "USD": 5219,
          "GBP": 4349
        },
        "current_discount": {
          "percent": 0.13,
          "display_percentage": true,
          "until": "2021-09-21T15:59:00.000Z",
          "from": "2021-09-19T07:01:00.464Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "Standard Edition"
      },
      {
        "bundles": [],
        "cover": "c6c6ece8-a74c-4f5f-ac85-f4e678388bc0.jpeg",
        "drm": {
          "voucher": false,
          "redeem": false,
          "utalk": false,
          "zenva": false,
          "magix": false,
          "gog": false,
          "threeds": false,
          "switch": false,
          "epicgames": false,
          "bethesda": false,
          "oculus": false,
          "uplay": false,
          "esonline": false,
          "rockstar": false,
          "origin": false,
          "steam": true,
          "drm_free": false
        },
        "name": "NBA 2K22: NBA 75th Anniversary Edition",
        "platforms": {
          "linux": false,
          "mac": false,
          "windows": true
        },
        "price": {
          "JPY": 1408000,
          "RUB": 874500,
          "AUD": 14995,
          "CAD": 11999,
          "EUR": 9999,
          "USD": 9999,
          "GBP": 8499
        },
        "slug": "nba-2-k-22-nba-75-th-anniversary-edition",
        "type": "game",
        "supplier_id": "",
        "sold_out": true,
        "currentPrice": {
          "JPY": 1224960,
          "RUB": 760815,
          "AUD": 13045,
          "CAD": 10439,
          "EUR": 8699,
          "USD": 8699,
          "GBP": 7394
        },
        "current_discount": {
          "percent": 0.13,
          "display_percentage": true,
          "until": "2021-09-21T15:59:00.000Z",
          "from": "2021-09-19T07:01:00.464Z",
          "best_ever": false,
          "flash_sale": false,
          "hide_timer": true,
          "highlighted": false
        },
        "drm_string": "steam",
        "platforms_string": "windows",
        "downloadTotal": 0,
        "tiered": false,
        "edition_name": "NBA 75th Anniversary Edition"
      }
    ],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "edition_name": "NBA 75th Anniversary Edition",
    "recommendations": [
      "nba-2-k-21-mamba-forever-edition",
      "nba-2-k-20-legend-edition",
      "nba-2-k-21",
      "nba-2-k-20",
      "nba-2k19",
      "nba-2-k-playgrounds-2",
      "payday-2",
      "sonic-all-stars-racing-transformed",
      "wwe-2k19",
      "unrailed",
      "human-fall-flat",
      "main-assembly",
      "football-manager-2021",
      "motorsport-manager",
      "vertical-drop-heroes-hd"
    ],
    "recommendations_challenger": [
      "nba-2-k-22",
      "nba-2-k-21-mamba-forever-edition",
      "nba-2-k-20-legend-edition",
      "nba-2-k-21",
      "nba-2-k-20",
      "nba-2k19",
      "nba-2-k-playgrounds-2",
      "payday-2",
      "sonic-all-stars-racing-transformed",
      "wwe-2k19",
      "unrailed",
      "human-fall-flat",
      "main-assembly",
      "football-manager-2021",
      "motorsport-manager"
    ],
    "videos": [
      {
        "id": "-78Pr_lQmNM",
        "title": "NBA 2K22 75TH ANNIVERSARY EDITION",
        "date": "2021-09-13T17:30:00Z",
        "thumbnail_url": "https://i.ytimg.com/vi/-78Pr_lQmNM/hqdefault.jpg"
      },
      {
        "id": "8o6v1wGt5wk",
        "title": "NBA2k22 75th Anniversary Pack Opening ( is it worth it )",
        "date": "2021-09-11T16:15:34Z",
        "thumbnail_url": "https://i.ytimg.com/vi/8o6v1wGt5wk/hqdefault.jpg"
      },
      {
        "id": "inPgm3UrLC4",
        "title": "Best Players to Use in Limited Week 1! | NBA 2K22 | SMTS1",
        "date": "2021-09-10T17:27:54Z",
        "thumbnail_url": "https://i.ytimg.com/vi/inPgm3UrLC4/hqdefault.jpg"
      },
      {
        "id": "3GYHuu9mWMk",
        "title": "NBA 2K22 thoughts and opinions",
        "date": "2021-07-30T17:35:48Z",
        "thumbnail_url": "https://i.ytimg.com/vi/3GYHuu9mWMk/hqdefault.jpg"
      },
      {
        "id": "NZpj1Vy2-0c",
        "title": "Damian Lillard Trade To Warriors - Leaving Blazers",
        "date": "2021-07-21T21:00:22Z",
        "thumbnail_url": "https://i.ytimg.com/vi/NZpj1Vy2-0c/hqdefault.jpg"
      },
      {
        "id": "GOsq53HlLeU",
        "title": "NBA 2k22 News ! Cover Athletes  and Releases Date Confirmed! September 10th",
        "date": "2021-07-01T13:38:13Z",
        "thumbnail_url": "https://i.ytimg.com/vi/GOsq53HlLeU/hqdefault.jpg"
      },
      {
        "id": "SQ0GFsW_jJc",
        "title": "GT 1030 : NBA 2K22 BENCHMARK TEST | INTEL CORE I3 4TH GEN | WsE Gaming",
        "date": "2021-09-12T08:44:33Z",
        "thumbnail_url": "https://i.ytimg.com/vi/SQ0GFsW_jJc/hqdefault.jpg"
      },
      {
        "id": "4yh1xCP5fsc",
        "title": "NBA 2K22 New Badges, Dunk Meter, Shooting and Dribbling Gameplay Blog!",
        "date": "2021-09-01T06:19:02Z",
        "thumbnail_url": "https://i.ytimg.com/vi/4yh1xCP5fsc/hqdefault.jpg"
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {}
  },
  {
    "_id": "5ce671022c9b138168ef6632",
    "__v": 65,
    "bundles": [],
    "platforms": {
      "linux": false,
      "mac": false,
      "windows": true
    },
    "price": {
      "JPY": 418000,
      "RUB": 152100,
      "AUD": 3199,
      "CAD": 2199,
      "EUR": 1999,
      "USD": 1999,
      "GBP": 1299
    },
    "img": [
      {
        "alt": "5d484055-c7b2-4470-b512-30c41ed0eb30.png",
        "slug": "5d484055-c7b2-4470-b512-30c41ed0eb30.png",
        "order": "99"
      },
      {
        "alt": "fc95a4c8-1fb8-4f7c-9bac-aac0d6f54a63.png",
        "slug": "fc95a4c8-1fb8-4f7c-9bac-aac0d6f54a63.png",
        "order": "99"
      },
      {
        "alt": "361d634a-6cbc-4aea-b0e1-a6a86256fc9d.png",
        "slug": "361d634a-6cbc-4aea-b0e1-a6a86256fc9d.png",
        "order": "99"
      },
      {
        "alt": "62460e65-3a76-410c-a50b-c599aaf449a5.png",
        "slug": "62460e65-3a76-410c-a50b-c599aaf449a5.png",
        "order": "99"
      },
      {
        "alt": "54d69bda-21be-499b-b257-edc48166c2a9.png",
        "slug": "54d69bda-21be-499b-b257-edc48166c2a9.png",
        "order": "99"
      },
      {
        "alt": "e88891e3-1a21-4ae8-bf70-3d1d213472c0.png",
        "slug": "e88891e3-1a21-4ae8-bf70-3d1d213472c0.png",
        "order": "99"
      },
      {
        "alt": "991a96c0-e583-43c0-ade6-5b5057fb505a.png",
        "slug": "991a96c0-e583-43c0-ade6-5b5057fb505a.png",
        "order": "99"
      },
      {
        "alt": "362fa707-7a5c-4a71-a3fe-c6e68fc9d44f.png",
        "slug": "362fa707-7a5c-4a71-a3fe-c6e68fc9d44f.png",
        "order": "99"
      },
      {
        "alt": "1d730af4-dec8-455f-b38f-7c84fe077051.png",
        "slug": "1d730af4-dec8-455f-b38f-7c84fe077051.png"
      }
    ],
    "visible": {
      "valid_from": "2019-06-03T15:00:00.000Z",
      "valid_until": null
    },
    "seo": {
      "desc": "Play Adam Jensen, an ex-SWAT specialist who's been handpicked to oversee the defensive needs of one of America's most experimental biotechnology firms",
      "title": null
    },
    "quotes": [],
    "type": "game",
    "display_type": "game",
    "developers": [
      "Eidos Montreal"
    ],
    "publishers": [
      "Square Enix"
    ],
    "collections": [
      "Story Rich Games"
    ],
    "franchises": [
      "Deus Ex"
    ],
    "modes": [
      "Singleplayer"
    ],
    "features": [
      "Steam Achievements",
      "Steam Trading Cards",
      "Captions available",
      "Partial Controller Support",
      "Steam Cloud",
      "Commentary available"
    ],
    "genres": [
      "Action",
      "RPG"
    ],
    "lang": [
      "English",
      "French",
      "Italian",
      "German",
      "Spanish - Spain"
    ],
    "regions_included": [],
    "regions_excluded": [],
    "video": [
      "aaQ1NvM6opo"
    ],
    "name": "Deus Ex: Human Revolution - Director's Cut",
    "url": "http://www.deusex.com/",
    "release": "2019-05-23T10:08:01.956Z",
    "platform_specs": {
      "win": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows XP, Windows Vista, Windows 7 or Windows 8<br></li><li><strong>Processor:</strong> 2 GHz dual core<br></li><li><strong>Memory:</strong> 2 GB RAM<br></li><li><strong>Graphics:</strong> NVIDIA GeForce 8000 series or ATI Radeon HD 2000 series or better<br></li><li><strong>DirectX:</strong> Version 9.0c<br></li><li><strong>Storage:</strong> 17 GB available space<br></li><li><strong>Sound Card:</strong> 100% DirectX 9.0c compatible sound device</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> Windows 7 or Windows 8<br></li><li><strong>Processor:</strong> AMD Phenom II X4 or Intel Core 2 Quad or better<br></li><li><strong>Memory:</strong> 2 GB RAM<br></li><li><strong>Graphics:</strong> AMD Radeon HD 5850<br></li><li><strong>DirectX:</strong> Version 9.0c<br></li><li><strong>Storage:</strong> 17 GB available space<br></li><li><strong>Sound Card:</strong> 100% DirectX 9.0c compatible sound device</li></ul>"
      },
      "mac": {
        "min": "<strong>Minimum:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> 10.8.5<br></li><li><strong>Processor:</strong> 2.0Ghz<br></li><li><strong>Memory:</strong> 4 GB RAM<br></li><li><strong>Graphics:</strong> 512MB<br></li><li><strong>Storage:</strong> 25 GB available space<br></li><li><strong>Additional Notes:</strong> The following graphics cards are not supported: ATI X1xxx series, ATI HD2xxx series, Intel GMA series, Intel HD3000, NVIDIA 7xxx series, NVIDIA 8xxx series, NVIDIA 9400 and NVIDIA 3xx series.   The following cards require you to have 8GB of system RAM: Intel HD4000.</li></ul>",
        "rec": "<strong>Recommended:</strong><br><ul class=\"bb_ul\"><li><strong>OS:</strong> 10.9.2<br></li><li><strong>Processor:</strong> 2.4Ghz<br></li><li><strong>Memory:</strong> 8 GB RAM<br></li><li><strong>Graphics:</strong> 1GB<br></li><li><strong>Storage:</strong> 25 GB available space</li></ul>"
      }
    },
    "slug": "deus-ex-human-revolution-director-s-cut",
    "steam": {
      "packages": [],
      "dlc": [],
      "release": "2013-10-25T00:00:00.000Z",
      "id": 238010,
      "type": "app"
    },
    "drm": {
      "voucher": false,
      "redeem": false,
      "utalk": false,
      "zenva": false,
      "magix": false,
      "gog": false,
      "threeds": false,
      "switch": false,
      "epicgames": false,
      "bethesda": false,
      "oculus": false,
      "uplay": false,
      "esonline": false,
      "rockstar": false,
      "origin": false,
      "steam": true,
      "drm_free": false
    },
    "notice": {
      "legal": "Deus Ex: Human Revolution – Director’s Cut © Square Enix Ltd. 2013. Developed by Eidos Montreal and Snowed in Studios Inc. Deus Ex: Human Revolution – Director’s Cut, Deus Ex: Human Revolution, the Deus Ex logo, Eidos Montreal and the Eidos logo are trademarks of Square Enix Ltd. Square Enix and the Square Enix logo are trademarks or registered trademarks of Square Enix Holdings Co. Ltd. This software product includes Autodesk® Scaleform® software, © 2013 Autodesk, Inc. All rights reserved. FMOD Ex Sound System, copyright © Firelight Technologies Pty, Ltd., 1994-2011. Facial animations generated with FaceFX. ©2002-2013, OC3 Entertainment, Inc. and its licensors. All rights reserved. This software product includes Autodesk® Gameware™ software, © 2013 Autodesk, Inc. All rights reserved. All other trademarks are the property of their respective owners. All rights reserved."
    },
    "age": {
      "ESRB": 17,
      "PEGI": 18,
      "USK": 18,
      "ACB": 15
    },
    "availability": {
      "valid_from": "2019-06-03T15:00:00.000Z",
      "valid_until": null
    },
    "artists": [],
    "authors": [],
    "cover": "478ec3fe-8bf9-480e-abed-a1c5cbca197e.jpeg",
    "downloads": [],
    "template_type": "standard",
    "sticky": 1,
    "showReview": true,
    "audit": [],
    "srp_override": {
      "JPY": null,
      "RUB": null,
      "AUD": null,
      "CAD": null,
      "EUR": null,
      "USD": null,
      "GBP": null
    },
    "desc": "<p>You play Adam Jensen, an ex-SWAT specialist who's been handpicked to oversee the defensive needs of one of America's most experimental biotechnology firms. Your job is to safeguard company secrets, but when a black ops team breaks in and kills the very scientists you were hired to protect, everything you thought you knew about your job changes.</p>&#10;<h2 class=\"bb_tag\">Key Features:</h2>&#10;<ul class=\"bb_ul\">&#10;<li><strong>A divided near-future:</strong> discover a time of great technological advancement, but also a time of chaos and conspiracy. Mechanical augmentations of the human body have divided society between those who can afford them, and those who can&#8217;t. Opposing forces conspire from the shadow to control the destiny of mankind: a human revolution is coming.</li>&#10;<li><strong>A perfect mix of action and role-play:</strong> the game uniquely combines action-packed close-quarters takedowns with intense shooting, offering a vast array of character augmentations and upgrades for the many weapons at your disposal. Unlock new abilities and increase your stealth, social, hacking or combat skills: the game rewards all styles of play and approaches. Determine how you want your character to evolve, based on how you want to play the game.</li>&#10;<li><strong>Choices and consequences:</strong> shoot your way through the enemies, sneak up behind them without being traced, hack systems to retrieve crucial information, or use your social skills to extract information from key characters &#8211; there are always choices, multiple approaches, multiple paths and multiple tools at your disposal. Choose your playing style and face the consequences of your actions: you decide how the story unfolds in his enhanced storyline featuring the full integration of &#34;The Missing Link&#34; and &#34;Tongs Mission&#34;. Find more ways to defeat the new and improved Boss Fights, use the Newgame+ feature to replay the story with your previously acquired augmentations. Learn more about the game with the developers commentaries in ENGLISH ONLY and the original &#34;Making of&#34;video.</li>&#10;</ul>",
    "hitcardVideo": "lloABzk22EFw1BYLvnqGtqqOrrvJ6-480p.mp4",
    "supplier_id": "5ce3e1fb848d140147800d87",
    "currentPrice": {
      "JPY": 418000,
      "RUB": 152100,
      "AUD": 3199,
      "CAD": 2199,
      "EUR": 1999,
      "USD": 1999,
      "GBP": 1299
    },
    "current_discount": {
      "percent": 0,
      "display_percentage": false
    },
    "drm_string": "steam",
    "platforms_string": "windows",
    "downloadTotal": 0,
    "tiered": false,
    "region_locked": false,
    "editions": [],
    "in_bundles": [],
    "packs": [],
    "base_game": null,
    "related": [],
    "recommendations": [
      "guilty-gear-xx-accent-core-plus-r",
      "arcana-heart-3-love-max",
      "call-of-duty-black-ops-annihilation-escalation-bundle-mac-edition",
      "me-and-my-cat-s-castle-x",
      "payday-2",
      "tron-2-0",
      "me-and-my-cat-s-castle",
      "foreclosed",
      "resident-evil-2-biohazard-re-2-extra-dlc-pack",
      "metro-last-light-redux",
      "chaos-code-new-sign-of-catastrophe",
      "gun-crazy",
      "detroit-become-human",
      "fallout-4",
      "the-last-blade"
    ],
    "recommendations_challenger": [
      "guilty-gear-xx-accent-core-plus-r",
      "arcana-heart-3-love-max",
      "call-of-duty-black-ops-annihilation-escalation-bundle-mac-edition",
      "me-and-my-cat-s-castle-x",
      "payday-2",
      "tron-2-0",
      "me-and-my-cat-s-castle",
      "foreclosed",
      "resident-evil-2-biohazard-re-2-extra-dlc-pack",
      "metro-last-light-redux",
      "chaos-code-new-sign-of-catastrophe",
      "gun-crazy",
      "detroit-become-human",
      "fallout-4",
      "the-last-blade"
    ],
    "videos": [
      {
        "id": "0Zh1Uldz7mc",
        "title": "Deus Ex: Human Revolution - Director&#39;s Cut You scratch my back ill scratch yours",
        "date": "2021-06-22T01:21:35Z",
        "thumbnail_url": "https://i.ytimg.com/vi/0Zh1Uldz7mc/hqdefault.jpg"
      },
      {
        "id": "PLzrGxpAWIw",
        "title": "Deus Ex - Human Revolution - Directors Cut (Part 38)",
        "date": "2015-08-24T00:09:37Z",
        "thumbnail_url": "https://i.ytimg.com/vi/PLzrGxpAWIw/hqdefault.jpg"
      },
      {
        "id": "i_dXZHy4zaQ",
        "title": "Deus Ex Human Revolution: Director&#39;s Cut - Episode 10",
        "date": "2014-02-01T20:02:11Z",
        "thumbnail_url": "https://i.ytimg.com/vi/i_dXZHy4zaQ/hqdefault.jpg"
      },
      {
        "id": "Q213E8V3IWQ",
        "title": "Deus Ex: Human Revolution - Directors Cut (Part 63)",
        "date": "2015-08-28T22:14:43Z",
        "thumbnail_url": "https://i.ytimg.com/vi/Q213E8V3IWQ/hqdefault.jpg"
      },
      {
        "id": "Jex0CzfwD1Y",
        "title": "Deus Ex: Human Revolution Director&#39;s Cut on GeForce GT 920M | Windows 10",
        "date": "2016-12-01T14:31:57Z",
        "thumbnail_url": "https://i.ytimg.com/vi/Jex0CzfwD1Y/hqdefault.jpg"
      },
      {
        "id": "pNy2Sx3m-rU",
        "title": "Deus Ex Human Revolution (Directors Cut) #1",
        "date": "2019-12-28T22:00:20Z",
        "thumbnail_url": "https://i.ytimg.com/vi/pNy2Sx3m-rU/hqdefault.jpg"
      },
      {
        "id": "fI8T7tVuA6o",
        "title": "Deus Ex - Human Revolution [Director&#39;s Cut] - Part 29",
        "date": "2016-06-19T20:26:22Z",
        "thumbnail_url": "https://i.ytimg.com/vi/fI8T7tVuA6o/hqdefault.jpg"
      },
      {
        "id": "PAdzD4TCJyQ",
        "title": "Deus Ex: Human Revolution - Directors Cut (Part 59)",
        "date": "2015-08-28T22:06:10Z",
        "thumbnail_url": "https://i.ytimg.com/vi/PAdzD4TCJyQ/hqdefault.jpg"
      }
    ],
    "blogPosts": [
      {
        "id": "XRCNkxEAACAApII1",
        "uid": "top-cyberpunk-games-you-need-to-check-out-steam-pc",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22XRCNkxEAACAApII1%22%29+%5D%5D",
        "tags": [
          "Cyberpunk",
          "Steam PC",
          "Top picks"
        ],
        "first_publication_date": "2019-06-24T16:31:31+0000",
        "last_publication_date": "2021-07-30T13:30:43+0000",
        "slugs": [
          "the-best-cyberpunk-games-for-pc-gamers",
          "top-cyberpunk-pc-games-you-need-to-check-out"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2021-01-01T17:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "The best cyberpunk games for PC gamers",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/4ef8da26-b6a3-45c0-8e2d-42ffae733813_TheAscent02.jpg?auto=compress,format&rect=0,0,1920,1080&w=1280&h=720",
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/4ef8da26-b6a3-45c0-8e2d-42ffae733813_TheAscent02.jpg?auto=compress,format&rect=0,0,1920,1080&w=752&h=423"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/4ef8da26-b6a3-45c0-8e2d-42ffae733813_TheAscent02.jpg?auto=compress,format&rect=0,0,1920,1080&w=400&h=225"
            },
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/4ef8da26-b6a3-45c0-8e2d-42ffae733813_TheAscent02.jpg?auto=compress,format&rect=0,0,1920,1080&w=224&h=126"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Get your futuristic fill with these cyberpunk games",
              "spans": []
            }
          ]
        }
      },
      {
        "id": "XRDLpxEAACEApVxQ",
        "uid": "over-1000-sizzling-steam-deals-now-live-in-the-red-hot-sale",
        "url": null,
        "type": "blog_template_groups",
        "href": "https://fanatical.cdn.prismic.io/api/v2/documents/search?ref=YUStbhAAACUAUij9&q=%5B%5B%3Ad+%3D+at%28document.id%2C+%22XRDLpxEAACEApVxQ%22%29+%5D%5D",
        "tags": [
          "Steam PC",
          "Red Hot Sale",
          "Fanatical",
          "AAA",
          "Indie"
        ],
        "first_publication_date": "2019-06-24T15:00:41+0000",
        "last_publication_date": "2020-04-02T14:43:00+0000",
        "slugs": [
          "over-1800-sizzling-steam-deals-now-live-in-the-red-hot-sale",
          "over-1000-sizzling-steam-deals-now-live-in-the-red-hot-sale"
        ],
        "linked_documents": [],
        "lang": "en-gb",
        "alternate_languages": [],
        "data": {
          "publication_datetime": "2019-06-27T11:00:00+0000",
          "title": [
            {
              "type": "heading1",
              "text": "Over 1,800 sizzling Steam deals now live in the Red Hot Sale",
              "spans": []
            }
          ],
          "cover": {
            "dimensions": {
              "width": 1280,
              "height": 720
            },
            "alt": null,
            "copyright": null,
            "url": "https://images.prismic.io/fanatical/ecfa117ddd2fdd9a859b270b1875b9c44f7640c4_blog-image.jpg?auto=compress,format",
            "224x126": {
              "dimensions": {
                "width": 224,
                "height": 126
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/7dc8db686f744c48726915f4a9635b9271f162b4_blog-image.jpg?auto=compress,format"
            },
            "400x225": {
              "dimensions": {
                "width": 400,
                "height": 225
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/b0f22a4942d9e4c33ca87feaeba423164e3d29f9_blog-image.jpg?auto=compress,format"
            },
            "752x423": {
              "dimensions": {
                "width": 752,
                "height": 423
              },
              "alt": null,
              "copyright": null,
              "url": "https://images.prismic.io/fanatical/465cf7659a5c87b14491b8c9809c9941d7a682b6_blog-image.jpg?auto=compress,format"
            }
          },
          "intro_text": [
            {
              "type": "paragraph",
              "text": "Sizzling deals on AAA & Indie Steam games",
              "spans": []
            }
          ]
        }
      }
    ],
    "userReviewData": {
      "reviews": []
    },
    "userReviewSummary": {
      "rating_score": 5,
      "total_ratings": 3,
      "percent_recommended": 67,
      "rating_score_breakdown": {
        "one_star_percentage": 0,
        "two_star_percentage": 0,
        "three_star_percentage": 0,
        "four_star_percentage": 0,
        "five_star_percentage": 100
      },
      "reviewLocales": [],
      "total_written_reviews": 0
    }
  }
];
export const insertProducts = async (req, res, next) => {
  try {
    await Product.insertMany(prod.map(x => {
      const { _id, userReviewData, reviews, userReviewSummary, ...rest } = x;
      return rest;
    }))
    res.status(200).send()
  } catch (error) {
    console.log(error)
  }
}