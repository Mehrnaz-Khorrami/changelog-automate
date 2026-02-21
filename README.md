## Trello Requirements for Correct Changelog Generation

- Only cards in the `RC` list are included; the list name must be exactly `RC`.
- Each card must have at least one project label; valid labels: `Site`, `Admin`, `Backend`, `B2B`.
- Each card must have one change-type label: `Feat`, `Fix`, `Refactor`. If none is present, the card defaults to `refactor`.
- Each card can have one extra label as a "section"; any label that is not a project label or change-type label is treated as the section.
- If no section label exists, the card is placed under `عمومی` (General).
- The card title is used as the changelog item text; descriptions are not used.

## موارد ضروری در ترلو برای ساخت صحیح Changelog

- فقط کارت‌های لیست `RC` وارد خروجی می‌شوند؛ لیست باید دقیقا با نام `RC` وجود داشته باشد.
- هر کارت باید حداقل یک لیبل پروژه داشته باشد؛ لیبل‌های معتبر: `Site`، `Admin`، `Backend`، `B2B`.
- هر کارت باید یکی از لیبل‌های نوع تغییر را داشته باشد: `Feat`، `Fix`، `Refactor`. اگر هیچ‌کدام نبود، کارت به‌صورت پیش‌فرض در دسته‌ی «رفکتور» قرار می‌گیرد.
- هر کارت می‌تواند یک لیبل اضافی به‌عنوان «بخش» داشته باشد؛ این لیبل هر چیزی به‌جز لیبل‌های پروژه و لیبل‌های نوع تغییر است.
- اگر لیبل بخش نداشته باشد، کارت در بخش «عمومی» قرار می‌گیرد.
- عنوان کارت همان متن آیتم changelog است؛ متن و توضیح از جای دیگری خوانده نمی‌شود.
