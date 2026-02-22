## Trello Requirements for Correct Changelog Generation

Short note: Some section titles are translated using AI (Gemini) and cached for reuse.

- Only cards in the `RC` list are included; the list name must be exactly `RC`.
- Each card must have at least one project label; valid labels: `Site`, `Admin`, `Backend`, `B2B`.
- Each card must have one change-type label: `Feat`, `Fix`, `Refactor`. If none is present, the card defaults to `refactor`.
- Each card can have one extra label as a "section"; any label that is not a project label or change-type label is treated as the section.
- If no section label exists, the card is placed under `عمومی` (General).
- The card title is used as the changelog item text; descriptions are not used.

## Setup

- Run `npm install`.
- Create a `.env` file with:
  - `TRELLO_KEY`
  - `TRELLO_TOKEN`
  - `BOARD_ID`
  - `TRELLO_API` (optional, defaults to `https://api.trello.com/1`)
  - `GEMINI_API_KEY`
- Keep `.env` out of git.

## Generate Changelog

- Run:
  - `node scriptss/generateChangelog.js 1404/12/02 fa`
- First argument is the release date (used in output filename).
- Second argument is the translation target language (optional; default is `fa`).
- New section titles are translated with Gemini and cached in `scriptss/translations.json`.

## Output

- Output file name: `changelog-<releaseDate>.json` (slashes are replaced with `-`).
- Structure: projects → categories (feat/fix/refactor) → sections → card titles.


## موارد ضروری در ترلو برای ساخت صحیح Changelog

توضیح کوتاه: بعضی از عناوین بخش‌ها با هوش مصنوعی (Gemini) ترجمه می‌شوند و برای استفاده‌های بعدی ذخیره می‌شوند.

- فقط کارت‌های لیست `RC` وارد خروجی می‌شوند؛ لیست باید دقیقا با نام `RC` وجود داشته باشد.
- هر کارت باید حداقل یک لیبل پروژه داشته باشد؛ لیبل‌های معتبر: `Site`، `Admin`، `Backend`، `B2B`.
- هر کارت باید یکی از لیبل‌های نوع تغییر را داشته باشد: `Feat`، `Fix`، `Refactor`. اگر هیچ‌کدام نبود، کارت به‌صورت پیش‌فرض در دسته‌ی «رفکتور» قرار می‌گیرد.
- هر کارت می‌تواند یک لیبل اضافی به‌عنوان «بخش» داشته باشد؛ این لیبل هر چیزی به‌جز لیبل‌های پروژه و لیبل‌های نوع تغییر است.
- اگر لیبل بخش نداشته باشد، کارت در بخش «عمومی» قرار می‌گیرد.
- عنوان کارت همان متن آیتم changelog است؛ متن و توضیح از جای دیگری خوانده نمی‌شود.

## راه‌اندازی

- `npm install` را اجرا کنید.
- یک فایل `.env` بسازید با مقادیر:
  - `TRELLO_KEY`
  - `TRELLO_TOKEN`
  - `BOARD_ID`
  - `TRELLO_API` (اختیاری، پیش‌فرض `https://api.trello.com/1`)
  - `GEMINI_API_KEY`
- فایل `.env` را در گیت قرار ندهید.

## ساخت Changelog

- اجرا:
  - `node scriptss/generateChangelog.js 1404/12/02 fa`
- آرگومان اول تاریخ ریلیز است (در نام فایل خروجی استفاده می‌شود).
- آرگومان دوم زبان مقصد ترجمه است (اختیاری، پیش‌فرض `fa`).
- عناوین بخش‌های جدید با Gemini ترجمه شده و در `scriptss/translations.json` ذخیره می‌شوند.

## خروجی

- نام فایل خروجی: `changelog-<releaseDate>.json` (اسلش‌ها با `-` جایگزین می‌شوند).
- ساختار: پروژه‌ها → دسته‌ها (feat/fix/refactor) → بخش‌ها → عنوان کارت‌ها.
