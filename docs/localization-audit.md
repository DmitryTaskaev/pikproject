## Localization Audit

Primary dictionary:
- `constants/siteTranslations.ts`

Primary helper:
- `composables/useSiteI18n.ts`

Already moved to the shared dictionary:
- Header and footer UI labels
- Cookies popup
- About page breadcrumb
- About production block
- About experience cards
- Lab block defaults
- Consultation block
- Order form labels and consent text
- Services block title
- Video play button
- Shared `Home` breadcrumb title

Still hardcoded and should be moved next:

Layout and shared UI:
- `components/ui/layout/header/HeaderActions.vue`
- `components/popups/ActionsPopup.vue`
- `components/popups/DownloadDocumentsPopup.vue`
- `components/SitemapGrid.vue`
- `components/TableFeature.vue`

Main page and shared homepage blocks:
- `components/blocks/Advantages.vue`
- `components/blocks/ProductCatalog.vue`
- `components/blocks/ProductionFacilities.vue`
- `components/blocks/SeoBlock.vue`
- `components/pages/main/MHero.vue`
- `components/pages/main/MAbout.vue`
- `components/sliders/PartnersSlider.vue`
- `components/Regalia.vue`

About, lab and contacts:
- `pages/contacts.vue`
- `components/pages/lab/LEquipment.vue`
- `components/pages/lab/LPrices.vue`
- `components/pages/lab/LTests.vue`
- `components/blocks/OwnCapacities.vue`

News, awards and details:
- `pages/news/[code].vue`
- `components/pages/news/NList.vue`
- `pages/awards.vue`
- `pages/details.vue`

Catalog, services and products:
- `pages/service-page.vue`
- `pages/products-catalog.vue`
- `pages/product-card.vue`
- `pages/product-card/[...path].vue`
- `components/pages/productCard/PCCatalog.vue`
- `components/pages/productPage/PPHero.vue`
- `components/pages/Solution/SHero.vue`
- `components/pages/catalog/CPipeCatalog.vue`

Projector and documents area:
- `pages/pro.vue`
- `components/pages/pro/ProList.vue`
- `components/modals/DocumentationModal.vue`
- `components/modals/DocumentsModal.vue`
- `components/modals/ExperienceCardModal.vue`

Static legal and legacy pages:
- `pages/public-offer.vue`
- `pages/news-item.vue`
- `pages/sitemap.vue`
- `pages/service-page.vue`

Fallback-only texts still living in components:
- `components/blocks/NewsBlock.vue`
- `components/blocks/ServiceCatalog.vue`
- `components/blocks/SupplyBlock.vue`
- `components/blocks/LabBlock.vue`
- `components/blocks/ProductCatalog.vue`
- `components/pages/main/MHero.vue`

Recommended next pass:
1. Move all fallback data arrays from block components into `constants/siteTranslations.ts`.
2. Replace hardcoded page titles and breadcrumbs in legacy routes with `useSiteI18n()`.
3. Move static modal and popup text to the dictionary.
4. After that, run another `rg -n "[А-Яа-яЁё]" pages components` to verify the residue.
