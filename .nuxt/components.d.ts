
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'HeroVideo': typeof import("../components/HeroVideo.vue")['default']
    'HeroWrapper': typeof import("../components/HeroWrapper.vue")['default']
    'LabTable': typeof import("../components/LabTable.vue")['default']
    'PromoStrip': typeof import("../components/PromoStrip.vue")['default']
    'Regalia': typeof import("../components/Regalia.vue")['default']
    'SearchComponent': typeof import("../components/SearchComponent.vue")['default']
    'ServiceItem': typeof import("../components/ServiceItem.vue")['default']
    'SitemapGrid': typeof import("../components/SitemapGrid.vue")['default']
    'SvgSprite': typeof import("../components/SvgSprite.vue")['default']
    'TableFeature': typeof import("../components/TableFeature.vue")['default']
    'Advantages': typeof import("../components/blocks/Advantages.vue")['default']
    'CollapsibleText': typeof import("../components/blocks/CollapsibleText.vue")['default']
    'ConsultationBlock': typeof import("../components/blocks/ConsultationBlock.vue")['default']
    'ContentBlock': typeof import("../components/blocks/ContentBlock.vue")['default']
    'Factory': typeof import("../components/blocks/Factory.vue")['default']
    'FittingBlock': typeof import("../components/blocks/FittingBlock.vue")['default']
    'LabBlock': typeof import("../components/blocks/LabBlock.vue")['default']
    'NewsBlock': typeof import("../components/blocks/NewsBlock.vue")['default']
    'OwnCapacities': typeof import("../components/blocks/OwnCapacities.vue")['default']
    'ProductCatalog': typeof import("../components/blocks/ProductCatalog.vue")['default']
    'ProductionFacilities': typeof import("../components/blocks/ProductionFacilities.vue")['default']
    'SeoBlock': typeof import("../components/blocks/SeoBlock.vue")['default']
    'ServiceCatalog': typeof import("../components/blocks/ServiceCatalog.vue")['default']
    'ServicesBlock': typeof import("../components/blocks/ServicesBlock.vue")['default']
    'SupplyBlock': typeof import("../components/blocks/SupplyBlock.vue")['default']
    'BenefitCard': typeof import("../components/cards/BenefitCard.vue")['default']
    'ContactCard': typeof import("../components/cards/ContactCard.vue")['default']
    'EquipmentCard': typeof import("../components/cards/EquipmentCard.vue")['default']
    'EquipmentNewCard': typeof import("../components/cards/EquipmentNewCard.vue")['default']
    'ExperienceCard': typeof import("../components/cards/ExperienceCard.vue")['default']
    'LabCard': typeof import("../components/cards/LabCard.vue")['default']
    'NewsCard': typeof import("../components/cards/NewsCard.vue")['default']
    'PipeCard': typeof import("../components/cards/PipeCard.vue")['default']
    'ProductCard': typeof import("../components/cards/ProductCard.vue")['default']
    'ProductTableCard': typeof import("../components/cards/ProductTableCard.vue")['default']
    'RegaliaCard': typeof import("../components/cards/RegaliaCard.vue")['default']
    'ServiceCard': typeof import("../components/cards/ServiceCard.vue")['default']
    'TestCard': typeof import("../components/cards/TestCard.vue")['default']
    'OrderForm': typeof import("../components/forms/OrderForm.vue")['default']
    'PipesList': typeof import("../components/list/PipesList.vue")['default']
    'DocumentationModal': typeof import("../components/modals/DocumentationModal.vue")['default']
    'DocumentsModal': typeof import("../components/modals/DocumentsModal.vue")['default']
    'ExperienceCardModal': typeof import("../components/modals/ExperienceCardModal.vue")['default']
    'OrderModal': typeof import("../components/modals/OrderModal.vue")['default']
    'SHero': typeof import("../components/pages/Solution/SHero.vue")['default']
    'AExperience': typeof import("../components/pages/about/AExperience.vue")['default']
    'AManufacture': typeof import("../components/pages/about/AManufacture.vue")['default']
    'APartners': typeof import("../components/pages/about/APartners.vue")['default']
    'AwardCard': typeof import("../components/pages/awards/AwardCard.vue")['default']
    'AwardsList': typeof import("../components/pages/awards/AwardsList.vue")['default']
    'CPipeCatalog': typeof import("../components/pages/catalog/CPipeCatalog.vue")['default']
    'CPSection': typeof import("../components/pages/contacts/CPSection.vue")['default']
    'DetailsList': typeof import("../components/pages/details/DetailsList.vue")['default']
    'LEquipment': typeof import("../components/pages/lab/LEquipment.vue")['default']
    'LPrices': typeof import("../components/pages/lab/LPrices.vue")['default']
    'LSection': typeof import("../components/pages/lab/LSection.vue")['default']
    'LTests': typeof import("../components/pages/lab/LTests.vue")['default']
    'MAbout': typeof import("../components/pages/main/MAbout.vue")['default']
    'MHero': typeof import("../components/pages/main/MHero.vue")['default']
    'NList': typeof import("../components/pages/news/NList.vue")['default']
    'NTitle': typeof import("../components/pages/news/NTitle.vue")['default']
    'ProItem': typeof import("../components/pages/pro/ProItem.vue")['default']
    'ProList': typeof import("../components/pages/pro/ProList.vue")['default']
    'PCCatalog': typeof import("../components/pages/productCard/PCCatalog.vue")['default']
    'PCDocuments': typeof import("../components/pages/productCard/PCDocuments.vue")['default']
    'PCHero': typeof import("../components/pages/productCard/PCHero.vue")['default']
    'PPCatalog': typeof import("../components/pages/productPage/PPCatalog.vue")['default']
    'PPHero': typeof import("../components/pages/productPage/PPHero.vue")['default']
    'PSCList': typeof import("../components/pages/productsCatalog/PSCList.vue")['default']
    'PSCTitle': typeof import("../components/pages/productsCatalog/PSCTitle.vue")['default']
    'POText': typeof import("../components/pages/publicOffer/POText.vue")['default']
    'SPList': typeof import("../components/pages/servicePage/SPList.vue")['default']
    'SCList': typeof import("../components/pages/servicesCatalog/SCList.vue")['default']
    'ActionsPopup': typeof import("../components/popups/ActionsPopup.vue")['default']
    'CookiesPopup': typeof import("../components/popups/CookiesPopup.vue")['default']
    'DownloadDocumentsPopup': typeof import("../components/popups/DownloadDocumentsPopup.vue")['default']
    'CatalogSection': typeof import("../components/sections/CatalogSection.vue")['default']
    'ConstructionSection': typeof import("../components/sections/ConstructionSection.vue")['default']
    'TableSection': typeof import("../components/sections/TableSection.vue")['default']
    'ConstructionSlider': typeof import("../components/sliders/ConstructionSlider.vue")['default']
    'DocumentSlider': typeof import("../components/sliders/DocumentSlider.vue")['default']
    'ExperienceSlider': typeof import("../components/sliders/ExperienceSlider.vue")['default']
    'NewsSlider': typeof import("../components/sliders/NewsSlider.vue")['default']
    'PCHeroSlider': typeof import("../components/sliders/PCHeroSlider.vue")['default']
    'PartnersSlider': typeof import("../components/sliders/PartnersSlider.vue")['default']
    'ProductTableSlider': typeof import("../components/sliders/ProductTableSlider.vue")['default']
    'ConstructionSlide': typeof import("../components/slides/ConstructionSlide.vue")['default']
    'DocumentSlide': typeof import("../components/slides/DocumentSlide.vue")['default']
    'ExperienceSlide': typeof import("../components/slides/ExperienceSlide.vue")['default']
    'MainHeroSlide': typeof import("../components/slides/MainHeroSlide.vue")['default']
    'PCHeroSlide': typeof import("../components/slides/PCHeroSlide.vue")['default']
    'PartnerSlide': typeof import("../components/slides/PartnerSlide.vue")['default']
    'ProductTableSlide': typeof import("../components/slides/ProductTableSlide.vue")['default']
    'ProductTable': typeof import("../components/tables/ProductTable.vue")['default']
    'BaseSwiper': typeof import("../components/ui/base/BaseSwiper.vue")['default']
    'BorderLine': typeof import("../components/ui/base/BorderLine.vue")['default']
    'Breadcrumbs': typeof import("../components/ui/base/Breadcrumbs.vue")['default']
    'Button': typeof import("../components/ui/base/Button.vue")['default']
    'CloseButton': typeof import("../components/ui/base/CloseButton.vue")['default']
    'CopyLink': typeof import("../components/ui/base/CopyLink.vue")['default']
    'CopyLinkComplex': typeof import("../components/ui/base/CopyLinkComplex.vue")['default']
    'CustomControls': typeof import("../components/ui/base/CustomControls.vue")['default']
    'DecorativeWrap': typeof import("../components/ui/base/DecorativeWrap.vue")['default']
    'Dropdown': typeof import("../components/ui/base/Dropdown.vue")['default']
    'Icon': typeof import("../components/ui/base/Icon.vue")['default']
    'Image': typeof import("../components/ui/base/Image.vue")['default']
    'Input': typeof import("../components/ui/base/Input.vue")['default']
    'Modal': typeof import("../components/ui/base/Modal.vue")['default']
    'NavBtn': typeof import("../components/ui/base/NavBtn.vue")['default']
    'NavLink': typeof import("../components/ui/base/NavLink.vue")['default']
    'PopupButton': typeof import("../components/ui/base/PopupButton.vue")['default']
    'SectionDropdown': typeof import("../components/ui/base/SectionDropdown.vue")['default']
    'SectionWrapper': typeof import("../components/ui/base/SectionWrapper.vue")['default']
    'Video': typeof import("../components/ui/base/Video.vue")['default']
    'Footer': typeof import("../components/ui/layout/footer/Footer.vue")['default']
    'FooterCard': typeof import("../components/ui/layout/footer/FooterCard.vue")['default']
    'FooterList': typeof import("../components/ui/layout/footer/FooterList.vue")['default']
    'Header': typeof import("../components/ui/layout/header/Header.vue")['default']
    'HeaderActions': typeof import("../components/ui/layout/header/HeaderActions.vue")['default']
    'HeaderNav': typeof import("../components/ui/layout/header/HeaderNav.vue")['default']
    'CustomTitle': typeof import("../components/ui/typography/CustomTitle.vue")['default']
    'Text': typeof import("../components/ui/typography/Text.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
    'NuxtPicture': typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyHeroVideo': LazyComponent<typeof import("../components/HeroVideo.vue")['default']>
    'LazyHeroWrapper': LazyComponent<typeof import("../components/HeroWrapper.vue")['default']>
    'LazyLabTable': LazyComponent<typeof import("../components/LabTable.vue")['default']>
    'LazyPromoStrip': LazyComponent<typeof import("../components/PromoStrip.vue")['default']>
    'LazyRegalia': LazyComponent<typeof import("../components/Regalia.vue")['default']>
    'LazySearchComponent': LazyComponent<typeof import("../components/SearchComponent.vue")['default']>
    'LazyServiceItem': LazyComponent<typeof import("../components/ServiceItem.vue")['default']>
    'LazySitemapGrid': LazyComponent<typeof import("../components/SitemapGrid.vue")['default']>
    'LazySvgSprite': LazyComponent<typeof import("../components/SvgSprite.vue")['default']>
    'LazyTableFeature': LazyComponent<typeof import("../components/TableFeature.vue")['default']>
    'LazyAdvantages': LazyComponent<typeof import("../components/blocks/Advantages.vue")['default']>
    'LazyCollapsibleText': LazyComponent<typeof import("../components/blocks/CollapsibleText.vue")['default']>
    'LazyConsultationBlock': LazyComponent<typeof import("../components/blocks/ConsultationBlock.vue")['default']>
    'LazyContentBlock': LazyComponent<typeof import("../components/blocks/ContentBlock.vue")['default']>
    'LazyFactory': LazyComponent<typeof import("../components/blocks/Factory.vue")['default']>
    'LazyFittingBlock': LazyComponent<typeof import("../components/blocks/FittingBlock.vue")['default']>
    'LazyLabBlock': LazyComponent<typeof import("../components/blocks/LabBlock.vue")['default']>
    'LazyNewsBlock': LazyComponent<typeof import("../components/blocks/NewsBlock.vue")['default']>
    'LazyOwnCapacities': LazyComponent<typeof import("../components/blocks/OwnCapacities.vue")['default']>
    'LazyProductCatalog': LazyComponent<typeof import("../components/blocks/ProductCatalog.vue")['default']>
    'LazyProductionFacilities': LazyComponent<typeof import("../components/blocks/ProductionFacilities.vue")['default']>
    'LazySeoBlock': LazyComponent<typeof import("../components/blocks/SeoBlock.vue")['default']>
    'LazyServiceCatalog': LazyComponent<typeof import("../components/blocks/ServiceCatalog.vue")['default']>
    'LazyServicesBlock': LazyComponent<typeof import("../components/blocks/ServicesBlock.vue")['default']>
    'LazySupplyBlock': LazyComponent<typeof import("../components/blocks/SupplyBlock.vue")['default']>
    'LazyBenefitCard': LazyComponent<typeof import("../components/cards/BenefitCard.vue")['default']>
    'LazyContactCard': LazyComponent<typeof import("../components/cards/ContactCard.vue")['default']>
    'LazyEquipmentCard': LazyComponent<typeof import("../components/cards/EquipmentCard.vue")['default']>
    'LazyEquipmentNewCard': LazyComponent<typeof import("../components/cards/EquipmentNewCard.vue")['default']>
    'LazyExperienceCard': LazyComponent<typeof import("../components/cards/ExperienceCard.vue")['default']>
    'LazyLabCard': LazyComponent<typeof import("../components/cards/LabCard.vue")['default']>
    'LazyNewsCard': LazyComponent<typeof import("../components/cards/NewsCard.vue")['default']>
    'LazyPipeCard': LazyComponent<typeof import("../components/cards/PipeCard.vue")['default']>
    'LazyProductCard': LazyComponent<typeof import("../components/cards/ProductCard.vue")['default']>
    'LazyProductTableCard': LazyComponent<typeof import("../components/cards/ProductTableCard.vue")['default']>
    'LazyRegaliaCard': LazyComponent<typeof import("../components/cards/RegaliaCard.vue")['default']>
    'LazyServiceCard': LazyComponent<typeof import("../components/cards/ServiceCard.vue")['default']>
    'LazyTestCard': LazyComponent<typeof import("../components/cards/TestCard.vue")['default']>
    'LazyOrderForm': LazyComponent<typeof import("../components/forms/OrderForm.vue")['default']>
    'LazyPipesList': LazyComponent<typeof import("../components/list/PipesList.vue")['default']>
    'LazyDocumentationModal': LazyComponent<typeof import("../components/modals/DocumentationModal.vue")['default']>
    'LazyDocumentsModal': LazyComponent<typeof import("../components/modals/DocumentsModal.vue")['default']>
    'LazyExperienceCardModal': LazyComponent<typeof import("../components/modals/ExperienceCardModal.vue")['default']>
    'LazyOrderModal': LazyComponent<typeof import("../components/modals/OrderModal.vue")['default']>
    'LazySHero': LazyComponent<typeof import("../components/pages/Solution/SHero.vue")['default']>
    'LazyAExperience': LazyComponent<typeof import("../components/pages/about/AExperience.vue")['default']>
    'LazyAManufacture': LazyComponent<typeof import("../components/pages/about/AManufacture.vue")['default']>
    'LazyAPartners': LazyComponent<typeof import("../components/pages/about/APartners.vue")['default']>
    'LazyAwardCard': LazyComponent<typeof import("../components/pages/awards/AwardCard.vue")['default']>
    'LazyAwardsList': LazyComponent<typeof import("../components/pages/awards/AwardsList.vue")['default']>
    'LazyCPipeCatalog': LazyComponent<typeof import("../components/pages/catalog/CPipeCatalog.vue")['default']>
    'LazyCPSection': LazyComponent<typeof import("../components/pages/contacts/CPSection.vue")['default']>
    'LazyDetailsList': LazyComponent<typeof import("../components/pages/details/DetailsList.vue")['default']>
    'LazyLEquipment': LazyComponent<typeof import("../components/pages/lab/LEquipment.vue")['default']>
    'LazyLPrices': LazyComponent<typeof import("../components/pages/lab/LPrices.vue")['default']>
    'LazyLSection': LazyComponent<typeof import("../components/pages/lab/LSection.vue")['default']>
    'LazyLTests': LazyComponent<typeof import("../components/pages/lab/LTests.vue")['default']>
    'LazyMAbout': LazyComponent<typeof import("../components/pages/main/MAbout.vue")['default']>
    'LazyMHero': LazyComponent<typeof import("../components/pages/main/MHero.vue")['default']>
    'LazyNList': LazyComponent<typeof import("../components/pages/news/NList.vue")['default']>
    'LazyNTitle': LazyComponent<typeof import("../components/pages/news/NTitle.vue")['default']>
    'LazyProItem': LazyComponent<typeof import("../components/pages/pro/ProItem.vue")['default']>
    'LazyProList': LazyComponent<typeof import("../components/pages/pro/ProList.vue")['default']>
    'LazyPCCatalog': LazyComponent<typeof import("../components/pages/productCard/PCCatalog.vue")['default']>
    'LazyPCDocuments': LazyComponent<typeof import("../components/pages/productCard/PCDocuments.vue")['default']>
    'LazyPCHero': LazyComponent<typeof import("../components/pages/productCard/PCHero.vue")['default']>
    'LazyPPCatalog': LazyComponent<typeof import("../components/pages/productPage/PPCatalog.vue")['default']>
    'LazyPPHero': LazyComponent<typeof import("../components/pages/productPage/PPHero.vue")['default']>
    'LazyPSCList': LazyComponent<typeof import("../components/pages/productsCatalog/PSCList.vue")['default']>
    'LazyPSCTitle': LazyComponent<typeof import("../components/pages/productsCatalog/PSCTitle.vue")['default']>
    'LazyPOText': LazyComponent<typeof import("../components/pages/publicOffer/POText.vue")['default']>
    'LazySPList': LazyComponent<typeof import("../components/pages/servicePage/SPList.vue")['default']>
    'LazySCList': LazyComponent<typeof import("../components/pages/servicesCatalog/SCList.vue")['default']>
    'LazyActionsPopup': LazyComponent<typeof import("../components/popups/ActionsPopup.vue")['default']>
    'LazyCookiesPopup': LazyComponent<typeof import("../components/popups/CookiesPopup.vue")['default']>
    'LazyDownloadDocumentsPopup': LazyComponent<typeof import("../components/popups/DownloadDocumentsPopup.vue")['default']>
    'LazyCatalogSection': LazyComponent<typeof import("../components/sections/CatalogSection.vue")['default']>
    'LazyConstructionSection': LazyComponent<typeof import("../components/sections/ConstructionSection.vue")['default']>
    'LazyTableSection': LazyComponent<typeof import("../components/sections/TableSection.vue")['default']>
    'LazyConstructionSlider': LazyComponent<typeof import("../components/sliders/ConstructionSlider.vue")['default']>
    'LazyDocumentSlider': LazyComponent<typeof import("../components/sliders/DocumentSlider.vue")['default']>
    'LazyExperienceSlider': LazyComponent<typeof import("../components/sliders/ExperienceSlider.vue")['default']>
    'LazyNewsSlider': LazyComponent<typeof import("../components/sliders/NewsSlider.vue")['default']>
    'LazyPCHeroSlider': LazyComponent<typeof import("../components/sliders/PCHeroSlider.vue")['default']>
    'LazyPartnersSlider': LazyComponent<typeof import("../components/sliders/PartnersSlider.vue")['default']>
    'LazyProductTableSlider': LazyComponent<typeof import("../components/sliders/ProductTableSlider.vue")['default']>
    'LazyConstructionSlide': LazyComponent<typeof import("../components/slides/ConstructionSlide.vue")['default']>
    'LazyDocumentSlide': LazyComponent<typeof import("../components/slides/DocumentSlide.vue")['default']>
    'LazyExperienceSlide': LazyComponent<typeof import("../components/slides/ExperienceSlide.vue")['default']>
    'LazyMainHeroSlide': LazyComponent<typeof import("../components/slides/MainHeroSlide.vue")['default']>
    'LazyPCHeroSlide': LazyComponent<typeof import("../components/slides/PCHeroSlide.vue")['default']>
    'LazyPartnerSlide': LazyComponent<typeof import("../components/slides/PartnerSlide.vue")['default']>
    'LazyProductTableSlide': LazyComponent<typeof import("../components/slides/ProductTableSlide.vue")['default']>
    'LazyProductTable': LazyComponent<typeof import("../components/tables/ProductTable.vue")['default']>
    'LazyBaseSwiper': LazyComponent<typeof import("../components/ui/base/BaseSwiper.vue")['default']>
    'LazyBorderLine': LazyComponent<typeof import("../components/ui/base/BorderLine.vue")['default']>
    'LazyBreadcrumbs': LazyComponent<typeof import("../components/ui/base/Breadcrumbs.vue")['default']>
    'LazyButton': LazyComponent<typeof import("../components/ui/base/Button.vue")['default']>
    'LazyCloseButton': LazyComponent<typeof import("../components/ui/base/CloseButton.vue")['default']>
    'LazyCopyLink': LazyComponent<typeof import("../components/ui/base/CopyLink.vue")['default']>
    'LazyCopyLinkComplex': LazyComponent<typeof import("../components/ui/base/CopyLinkComplex.vue")['default']>
    'LazyCustomControls': LazyComponent<typeof import("../components/ui/base/CustomControls.vue")['default']>
    'LazyDecorativeWrap': LazyComponent<typeof import("../components/ui/base/DecorativeWrap.vue")['default']>
    'LazyDropdown': LazyComponent<typeof import("../components/ui/base/Dropdown.vue")['default']>
    'LazyIcon': LazyComponent<typeof import("../components/ui/base/Icon.vue")['default']>
    'LazyImage': LazyComponent<typeof import("../components/ui/base/Image.vue")['default']>
    'LazyInput': LazyComponent<typeof import("../components/ui/base/Input.vue")['default']>
    'LazyModal': LazyComponent<typeof import("../components/ui/base/Modal.vue")['default']>
    'LazyNavBtn': LazyComponent<typeof import("../components/ui/base/NavBtn.vue")['default']>
    'LazyNavLink': LazyComponent<typeof import("../components/ui/base/NavLink.vue")['default']>
    'LazyPopupButton': LazyComponent<typeof import("../components/ui/base/PopupButton.vue")['default']>
    'LazySectionDropdown': LazyComponent<typeof import("../components/ui/base/SectionDropdown.vue")['default']>
    'LazySectionWrapper': LazyComponent<typeof import("../components/ui/base/SectionWrapper.vue")['default']>
    'LazyVideo': LazyComponent<typeof import("../components/ui/base/Video.vue")['default']>
    'LazyFooter': LazyComponent<typeof import("../components/ui/layout/footer/Footer.vue")['default']>
    'LazyFooterCard': LazyComponent<typeof import("../components/ui/layout/footer/FooterCard.vue")['default']>
    'LazyFooterList': LazyComponent<typeof import("../components/ui/layout/footer/FooterList.vue")['default']>
    'LazyHeader': LazyComponent<typeof import("../components/ui/layout/header/Header.vue")['default']>
    'LazyHeaderActions': LazyComponent<typeof import("../components/ui/layout/header/HeaderActions.vue")['default']>
    'LazyHeaderNav': LazyComponent<typeof import("../components/ui/layout/header/HeaderNav.vue")['default']>
    'LazyCustomTitle': LazyComponent<typeof import("../components/ui/typography/CustomTitle.vue")['default']>
    'LazyText': LazyComponent<typeof import("../components/ui/typography/Text.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const HeroVideo: typeof import("../components/HeroVideo.vue")['default']
export const HeroWrapper: typeof import("../components/HeroWrapper.vue")['default']
export const LabTable: typeof import("../components/LabTable.vue")['default']
export const PromoStrip: typeof import("../components/PromoStrip.vue")['default']
export const Regalia: typeof import("../components/Regalia.vue")['default']
export const SearchComponent: typeof import("../components/SearchComponent.vue")['default']
export const ServiceItem: typeof import("../components/ServiceItem.vue")['default']
export const SitemapGrid: typeof import("../components/SitemapGrid.vue")['default']
export const SvgSprite: typeof import("../components/SvgSprite.vue")['default']
export const TableFeature: typeof import("../components/TableFeature.vue")['default']
export const Advantages: typeof import("../components/blocks/Advantages.vue")['default']
export const CollapsibleText: typeof import("../components/blocks/CollapsibleText.vue")['default']
export const ConsultationBlock: typeof import("../components/blocks/ConsultationBlock.vue")['default']
export const ContentBlock: typeof import("../components/blocks/ContentBlock.vue")['default']
export const Factory: typeof import("../components/blocks/Factory.vue")['default']
export const FittingBlock: typeof import("../components/blocks/FittingBlock.vue")['default']
export const LabBlock: typeof import("../components/blocks/LabBlock.vue")['default']
export const NewsBlock: typeof import("../components/blocks/NewsBlock.vue")['default']
export const OwnCapacities: typeof import("../components/blocks/OwnCapacities.vue")['default']
export const ProductCatalog: typeof import("../components/blocks/ProductCatalog.vue")['default']
export const ProductionFacilities: typeof import("../components/blocks/ProductionFacilities.vue")['default']
export const SeoBlock: typeof import("../components/blocks/SeoBlock.vue")['default']
export const ServiceCatalog: typeof import("../components/blocks/ServiceCatalog.vue")['default']
export const ServicesBlock: typeof import("../components/blocks/ServicesBlock.vue")['default']
export const SupplyBlock: typeof import("../components/blocks/SupplyBlock.vue")['default']
export const BenefitCard: typeof import("../components/cards/BenefitCard.vue")['default']
export const ContactCard: typeof import("../components/cards/ContactCard.vue")['default']
export const EquipmentCard: typeof import("../components/cards/EquipmentCard.vue")['default']
export const EquipmentNewCard: typeof import("../components/cards/EquipmentNewCard.vue")['default']
export const ExperienceCard: typeof import("../components/cards/ExperienceCard.vue")['default']
export const LabCard: typeof import("../components/cards/LabCard.vue")['default']
export const NewsCard: typeof import("../components/cards/NewsCard.vue")['default']
export const PipeCard: typeof import("../components/cards/PipeCard.vue")['default']
export const ProductCard: typeof import("../components/cards/ProductCard.vue")['default']
export const ProductTableCard: typeof import("../components/cards/ProductTableCard.vue")['default']
export const RegaliaCard: typeof import("../components/cards/RegaliaCard.vue")['default']
export const ServiceCard: typeof import("../components/cards/ServiceCard.vue")['default']
export const TestCard: typeof import("../components/cards/TestCard.vue")['default']
export const OrderForm: typeof import("../components/forms/OrderForm.vue")['default']
export const PipesList: typeof import("../components/list/PipesList.vue")['default']
export const DocumentationModal: typeof import("../components/modals/DocumentationModal.vue")['default']
export const DocumentsModal: typeof import("../components/modals/DocumentsModal.vue")['default']
export const ExperienceCardModal: typeof import("../components/modals/ExperienceCardModal.vue")['default']
export const OrderModal: typeof import("../components/modals/OrderModal.vue")['default']
export const SHero: typeof import("../components/pages/Solution/SHero.vue")['default']
export const AExperience: typeof import("../components/pages/about/AExperience.vue")['default']
export const AManufacture: typeof import("../components/pages/about/AManufacture.vue")['default']
export const APartners: typeof import("../components/pages/about/APartners.vue")['default']
export const AwardCard: typeof import("../components/pages/awards/AwardCard.vue")['default']
export const AwardsList: typeof import("../components/pages/awards/AwardsList.vue")['default']
export const CPipeCatalog: typeof import("../components/pages/catalog/CPipeCatalog.vue")['default']
export const CPSection: typeof import("../components/pages/contacts/CPSection.vue")['default']
export const DetailsList: typeof import("../components/pages/details/DetailsList.vue")['default']
export const LEquipment: typeof import("../components/pages/lab/LEquipment.vue")['default']
export const LPrices: typeof import("../components/pages/lab/LPrices.vue")['default']
export const LSection: typeof import("../components/pages/lab/LSection.vue")['default']
export const LTests: typeof import("../components/pages/lab/LTests.vue")['default']
export const MAbout: typeof import("../components/pages/main/MAbout.vue")['default']
export const MHero: typeof import("../components/pages/main/MHero.vue")['default']
export const NList: typeof import("../components/pages/news/NList.vue")['default']
export const NTitle: typeof import("../components/pages/news/NTitle.vue")['default']
export const ProItem: typeof import("../components/pages/pro/ProItem.vue")['default']
export const ProList: typeof import("../components/pages/pro/ProList.vue")['default']
export const PCCatalog: typeof import("../components/pages/productCard/PCCatalog.vue")['default']
export const PCDocuments: typeof import("../components/pages/productCard/PCDocuments.vue")['default']
export const PCHero: typeof import("../components/pages/productCard/PCHero.vue")['default']
export const PPCatalog: typeof import("../components/pages/productPage/PPCatalog.vue")['default']
export const PPHero: typeof import("../components/pages/productPage/PPHero.vue")['default']
export const PSCList: typeof import("../components/pages/productsCatalog/PSCList.vue")['default']
export const PSCTitle: typeof import("../components/pages/productsCatalog/PSCTitle.vue")['default']
export const POText: typeof import("../components/pages/publicOffer/POText.vue")['default']
export const SPList: typeof import("../components/pages/servicePage/SPList.vue")['default']
export const SCList: typeof import("../components/pages/servicesCatalog/SCList.vue")['default']
export const ActionsPopup: typeof import("../components/popups/ActionsPopup.vue")['default']
export const CookiesPopup: typeof import("../components/popups/CookiesPopup.vue")['default']
export const DownloadDocumentsPopup: typeof import("../components/popups/DownloadDocumentsPopup.vue")['default']
export const CatalogSection: typeof import("../components/sections/CatalogSection.vue")['default']
export const ConstructionSection: typeof import("../components/sections/ConstructionSection.vue")['default']
export const TableSection: typeof import("../components/sections/TableSection.vue")['default']
export const ConstructionSlider: typeof import("../components/sliders/ConstructionSlider.vue")['default']
export const DocumentSlider: typeof import("../components/sliders/DocumentSlider.vue")['default']
export const ExperienceSlider: typeof import("../components/sliders/ExperienceSlider.vue")['default']
export const NewsSlider: typeof import("../components/sliders/NewsSlider.vue")['default']
export const PCHeroSlider: typeof import("../components/sliders/PCHeroSlider.vue")['default']
export const PartnersSlider: typeof import("../components/sliders/PartnersSlider.vue")['default']
export const ProductTableSlider: typeof import("../components/sliders/ProductTableSlider.vue")['default']
export const ConstructionSlide: typeof import("../components/slides/ConstructionSlide.vue")['default']
export const DocumentSlide: typeof import("../components/slides/DocumentSlide.vue")['default']
export const ExperienceSlide: typeof import("../components/slides/ExperienceSlide.vue")['default']
export const MainHeroSlide: typeof import("../components/slides/MainHeroSlide.vue")['default']
export const PCHeroSlide: typeof import("../components/slides/PCHeroSlide.vue")['default']
export const PartnerSlide: typeof import("../components/slides/PartnerSlide.vue")['default']
export const ProductTableSlide: typeof import("../components/slides/ProductTableSlide.vue")['default']
export const ProductTable: typeof import("../components/tables/ProductTable.vue")['default']
export const BaseSwiper: typeof import("../components/ui/base/BaseSwiper.vue")['default']
export const BorderLine: typeof import("../components/ui/base/BorderLine.vue")['default']
export const Breadcrumbs: typeof import("../components/ui/base/Breadcrumbs.vue")['default']
export const Button: typeof import("../components/ui/base/Button.vue")['default']
export const CloseButton: typeof import("../components/ui/base/CloseButton.vue")['default']
export const CopyLink: typeof import("../components/ui/base/CopyLink.vue")['default']
export const CopyLinkComplex: typeof import("../components/ui/base/CopyLinkComplex.vue")['default']
export const CustomControls: typeof import("../components/ui/base/CustomControls.vue")['default']
export const DecorativeWrap: typeof import("../components/ui/base/DecorativeWrap.vue")['default']
export const Dropdown: typeof import("../components/ui/base/Dropdown.vue")['default']
export const Icon: typeof import("../components/ui/base/Icon.vue")['default']
export const Image: typeof import("../components/ui/base/Image.vue")['default']
export const Input: typeof import("../components/ui/base/Input.vue")['default']
export const Modal: typeof import("../components/ui/base/Modal.vue")['default']
export const NavBtn: typeof import("../components/ui/base/NavBtn.vue")['default']
export const NavLink: typeof import("../components/ui/base/NavLink.vue")['default']
export const PopupButton: typeof import("../components/ui/base/PopupButton.vue")['default']
export const SectionDropdown: typeof import("../components/ui/base/SectionDropdown.vue")['default']
export const SectionWrapper: typeof import("../components/ui/base/SectionWrapper.vue")['default']
export const Video: typeof import("../components/ui/base/Video.vue")['default']
export const Footer: typeof import("../components/ui/layout/footer/Footer.vue")['default']
export const FooterCard: typeof import("../components/ui/layout/footer/FooterCard.vue")['default']
export const FooterList: typeof import("../components/ui/layout/footer/FooterList.vue")['default']
export const Header: typeof import("../components/ui/layout/header/Header.vue")['default']
export const HeaderActions: typeof import("../components/ui/layout/header/HeaderActions.vue")['default']
export const HeaderNav: typeof import("../components/ui/layout/header/HeaderNav.vue")['default']
export const CustomTitle: typeof import("../components/ui/typography/CustomTitle.vue")['default']
export const Text: typeof import("../components/ui/typography/Text.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']
export const NuxtPicture: typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyHeroVideo: LazyComponent<typeof import("../components/HeroVideo.vue")['default']>
export const LazyHeroWrapper: LazyComponent<typeof import("../components/HeroWrapper.vue")['default']>
export const LazyLabTable: LazyComponent<typeof import("../components/LabTable.vue")['default']>
export const LazyPromoStrip: LazyComponent<typeof import("../components/PromoStrip.vue")['default']>
export const LazyRegalia: LazyComponent<typeof import("../components/Regalia.vue")['default']>
export const LazySearchComponent: LazyComponent<typeof import("../components/SearchComponent.vue")['default']>
export const LazyServiceItem: LazyComponent<typeof import("../components/ServiceItem.vue")['default']>
export const LazySitemapGrid: LazyComponent<typeof import("../components/SitemapGrid.vue")['default']>
export const LazySvgSprite: LazyComponent<typeof import("../components/SvgSprite.vue")['default']>
export const LazyTableFeature: LazyComponent<typeof import("../components/TableFeature.vue")['default']>
export const LazyAdvantages: LazyComponent<typeof import("../components/blocks/Advantages.vue")['default']>
export const LazyCollapsibleText: LazyComponent<typeof import("../components/blocks/CollapsibleText.vue")['default']>
export const LazyConsultationBlock: LazyComponent<typeof import("../components/blocks/ConsultationBlock.vue")['default']>
export const LazyContentBlock: LazyComponent<typeof import("../components/blocks/ContentBlock.vue")['default']>
export const LazyFactory: LazyComponent<typeof import("../components/blocks/Factory.vue")['default']>
export const LazyFittingBlock: LazyComponent<typeof import("../components/blocks/FittingBlock.vue")['default']>
export const LazyLabBlock: LazyComponent<typeof import("../components/blocks/LabBlock.vue")['default']>
export const LazyNewsBlock: LazyComponent<typeof import("../components/blocks/NewsBlock.vue")['default']>
export const LazyOwnCapacities: LazyComponent<typeof import("../components/blocks/OwnCapacities.vue")['default']>
export const LazyProductCatalog: LazyComponent<typeof import("../components/blocks/ProductCatalog.vue")['default']>
export const LazyProductionFacilities: LazyComponent<typeof import("../components/blocks/ProductionFacilities.vue")['default']>
export const LazySeoBlock: LazyComponent<typeof import("../components/blocks/SeoBlock.vue")['default']>
export const LazyServiceCatalog: LazyComponent<typeof import("../components/blocks/ServiceCatalog.vue")['default']>
export const LazyServicesBlock: LazyComponent<typeof import("../components/blocks/ServicesBlock.vue")['default']>
export const LazySupplyBlock: LazyComponent<typeof import("../components/blocks/SupplyBlock.vue")['default']>
export const LazyBenefitCard: LazyComponent<typeof import("../components/cards/BenefitCard.vue")['default']>
export const LazyContactCard: LazyComponent<typeof import("../components/cards/ContactCard.vue")['default']>
export const LazyEquipmentCard: LazyComponent<typeof import("../components/cards/EquipmentCard.vue")['default']>
export const LazyEquipmentNewCard: LazyComponent<typeof import("../components/cards/EquipmentNewCard.vue")['default']>
export const LazyExperienceCard: LazyComponent<typeof import("../components/cards/ExperienceCard.vue")['default']>
export const LazyLabCard: LazyComponent<typeof import("../components/cards/LabCard.vue")['default']>
export const LazyNewsCard: LazyComponent<typeof import("../components/cards/NewsCard.vue")['default']>
export const LazyPipeCard: LazyComponent<typeof import("../components/cards/PipeCard.vue")['default']>
export const LazyProductCard: LazyComponent<typeof import("../components/cards/ProductCard.vue")['default']>
export const LazyProductTableCard: LazyComponent<typeof import("../components/cards/ProductTableCard.vue")['default']>
export const LazyRegaliaCard: LazyComponent<typeof import("../components/cards/RegaliaCard.vue")['default']>
export const LazyServiceCard: LazyComponent<typeof import("../components/cards/ServiceCard.vue")['default']>
export const LazyTestCard: LazyComponent<typeof import("../components/cards/TestCard.vue")['default']>
export const LazyOrderForm: LazyComponent<typeof import("../components/forms/OrderForm.vue")['default']>
export const LazyPipesList: LazyComponent<typeof import("../components/list/PipesList.vue")['default']>
export const LazyDocumentationModal: LazyComponent<typeof import("../components/modals/DocumentationModal.vue")['default']>
export const LazyDocumentsModal: LazyComponent<typeof import("../components/modals/DocumentsModal.vue")['default']>
export const LazyExperienceCardModal: LazyComponent<typeof import("../components/modals/ExperienceCardModal.vue")['default']>
export const LazyOrderModal: LazyComponent<typeof import("../components/modals/OrderModal.vue")['default']>
export const LazySHero: LazyComponent<typeof import("../components/pages/Solution/SHero.vue")['default']>
export const LazyAExperience: LazyComponent<typeof import("../components/pages/about/AExperience.vue")['default']>
export const LazyAManufacture: LazyComponent<typeof import("../components/pages/about/AManufacture.vue")['default']>
export const LazyAPartners: LazyComponent<typeof import("../components/pages/about/APartners.vue")['default']>
export const LazyAwardCard: LazyComponent<typeof import("../components/pages/awards/AwardCard.vue")['default']>
export const LazyAwardsList: LazyComponent<typeof import("../components/pages/awards/AwardsList.vue")['default']>
export const LazyCPipeCatalog: LazyComponent<typeof import("../components/pages/catalog/CPipeCatalog.vue")['default']>
export const LazyCPSection: LazyComponent<typeof import("../components/pages/contacts/CPSection.vue")['default']>
export const LazyDetailsList: LazyComponent<typeof import("../components/pages/details/DetailsList.vue")['default']>
export const LazyLEquipment: LazyComponent<typeof import("../components/pages/lab/LEquipment.vue")['default']>
export const LazyLPrices: LazyComponent<typeof import("../components/pages/lab/LPrices.vue")['default']>
export const LazyLSection: LazyComponent<typeof import("../components/pages/lab/LSection.vue")['default']>
export const LazyLTests: LazyComponent<typeof import("../components/pages/lab/LTests.vue")['default']>
export const LazyMAbout: LazyComponent<typeof import("../components/pages/main/MAbout.vue")['default']>
export const LazyMHero: LazyComponent<typeof import("../components/pages/main/MHero.vue")['default']>
export const LazyNList: LazyComponent<typeof import("../components/pages/news/NList.vue")['default']>
export const LazyNTitle: LazyComponent<typeof import("../components/pages/news/NTitle.vue")['default']>
export const LazyProItem: LazyComponent<typeof import("../components/pages/pro/ProItem.vue")['default']>
export const LazyProList: LazyComponent<typeof import("../components/pages/pro/ProList.vue")['default']>
export const LazyPCCatalog: LazyComponent<typeof import("../components/pages/productCard/PCCatalog.vue")['default']>
export const LazyPCDocuments: LazyComponent<typeof import("../components/pages/productCard/PCDocuments.vue")['default']>
export const LazyPCHero: LazyComponent<typeof import("../components/pages/productCard/PCHero.vue")['default']>
export const LazyPPCatalog: LazyComponent<typeof import("../components/pages/productPage/PPCatalog.vue")['default']>
export const LazyPPHero: LazyComponent<typeof import("../components/pages/productPage/PPHero.vue")['default']>
export const LazyPSCList: LazyComponent<typeof import("../components/pages/productsCatalog/PSCList.vue")['default']>
export const LazyPSCTitle: LazyComponent<typeof import("../components/pages/productsCatalog/PSCTitle.vue")['default']>
export const LazyPOText: LazyComponent<typeof import("../components/pages/publicOffer/POText.vue")['default']>
export const LazySPList: LazyComponent<typeof import("../components/pages/servicePage/SPList.vue")['default']>
export const LazySCList: LazyComponent<typeof import("../components/pages/servicesCatalog/SCList.vue")['default']>
export const LazyActionsPopup: LazyComponent<typeof import("../components/popups/ActionsPopup.vue")['default']>
export const LazyCookiesPopup: LazyComponent<typeof import("../components/popups/CookiesPopup.vue")['default']>
export const LazyDownloadDocumentsPopup: LazyComponent<typeof import("../components/popups/DownloadDocumentsPopup.vue")['default']>
export const LazyCatalogSection: LazyComponent<typeof import("../components/sections/CatalogSection.vue")['default']>
export const LazyConstructionSection: LazyComponent<typeof import("../components/sections/ConstructionSection.vue")['default']>
export const LazyTableSection: LazyComponent<typeof import("../components/sections/TableSection.vue")['default']>
export const LazyConstructionSlider: LazyComponent<typeof import("../components/sliders/ConstructionSlider.vue")['default']>
export const LazyDocumentSlider: LazyComponent<typeof import("../components/sliders/DocumentSlider.vue")['default']>
export const LazyExperienceSlider: LazyComponent<typeof import("../components/sliders/ExperienceSlider.vue")['default']>
export const LazyNewsSlider: LazyComponent<typeof import("../components/sliders/NewsSlider.vue")['default']>
export const LazyPCHeroSlider: LazyComponent<typeof import("../components/sliders/PCHeroSlider.vue")['default']>
export const LazyPartnersSlider: LazyComponent<typeof import("../components/sliders/PartnersSlider.vue")['default']>
export const LazyProductTableSlider: LazyComponent<typeof import("../components/sliders/ProductTableSlider.vue")['default']>
export const LazyConstructionSlide: LazyComponent<typeof import("../components/slides/ConstructionSlide.vue")['default']>
export const LazyDocumentSlide: LazyComponent<typeof import("../components/slides/DocumentSlide.vue")['default']>
export const LazyExperienceSlide: LazyComponent<typeof import("../components/slides/ExperienceSlide.vue")['default']>
export const LazyMainHeroSlide: LazyComponent<typeof import("../components/slides/MainHeroSlide.vue")['default']>
export const LazyPCHeroSlide: LazyComponent<typeof import("../components/slides/PCHeroSlide.vue")['default']>
export const LazyPartnerSlide: LazyComponent<typeof import("../components/slides/PartnerSlide.vue")['default']>
export const LazyProductTableSlide: LazyComponent<typeof import("../components/slides/ProductTableSlide.vue")['default']>
export const LazyProductTable: LazyComponent<typeof import("../components/tables/ProductTable.vue")['default']>
export const LazyBaseSwiper: LazyComponent<typeof import("../components/ui/base/BaseSwiper.vue")['default']>
export const LazyBorderLine: LazyComponent<typeof import("../components/ui/base/BorderLine.vue")['default']>
export const LazyBreadcrumbs: LazyComponent<typeof import("../components/ui/base/Breadcrumbs.vue")['default']>
export const LazyButton: LazyComponent<typeof import("../components/ui/base/Button.vue")['default']>
export const LazyCloseButton: LazyComponent<typeof import("../components/ui/base/CloseButton.vue")['default']>
export const LazyCopyLink: LazyComponent<typeof import("../components/ui/base/CopyLink.vue")['default']>
export const LazyCopyLinkComplex: LazyComponent<typeof import("../components/ui/base/CopyLinkComplex.vue")['default']>
export const LazyCustomControls: LazyComponent<typeof import("../components/ui/base/CustomControls.vue")['default']>
export const LazyDecorativeWrap: LazyComponent<typeof import("../components/ui/base/DecorativeWrap.vue")['default']>
export const LazyDropdown: LazyComponent<typeof import("../components/ui/base/Dropdown.vue")['default']>
export const LazyIcon: LazyComponent<typeof import("../components/ui/base/Icon.vue")['default']>
export const LazyImage: LazyComponent<typeof import("../components/ui/base/Image.vue")['default']>
export const LazyInput: LazyComponent<typeof import("../components/ui/base/Input.vue")['default']>
export const LazyModal: LazyComponent<typeof import("../components/ui/base/Modal.vue")['default']>
export const LazyNavBtn: LazyComponent<typeof import("../components/ui/base/NavBtn.vue")['default']>
export const LazyNavLink: LazyComponent<typeof import("../components/ui/base/NavLink.vue")['default']>
export const LazyPopupButton: LazyComponent<typeof import("../components/ui/base/PopupButton.vue")['default']>
export const LazySectionDropdown: LazyComponent<typeof import("../components/ui/base/SectionDropdown.vue")['default']>
export const LazySectionWrapper: LazyComponent<typeof import("../components/ui/base/SectionWrapper.vue")['default']>
export const LazyVideo: LazyComponent<typeof import("../components/ui/base/Video.vue")['default']>
export const LazyFooter: LazyComponent<typeof import("../components/ui/layout/footer/Footer.vue")['default']>
export const LazyFooterCard: LazyComponent<typeof import("../components/ui/layout/footer/FooterCard.vue")['default']>
export const LazyFooterList: LazyComponent<typeof import("../components/ui/layout/footer/FooterList.vue")['default']>
export const LazyHeader: LazyComponent<typeof import("../components/ui/layout/header/Header.vue")['default']>
export const LazyHeaderActions: LazyComponent<typeof import("../components/ui/layout/header/HeaderActions.vue")['default']>
export const LazyHeaderNav: LazyComponent<typeof import("../components/ui/layout/header/HeaderNav.vue")['default']>
export const LazyCustomTitle: LazyComponent<typeof import("../components/ui/typography/CustomTitle.vue")['default']>
export const LazyText: LazyComponent<typeof import("../components/ui/typography/Text.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue")['default']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/@nuxt/image/dist/runtime/components/NuxtPicture.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
