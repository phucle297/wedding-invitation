<script setup lang="ts">
import { ref } from "vue";
import { useInvitationMotion } from "./composables/useInvitationMotion";
import BackToTop from "./components/BackToTop.vue";
import StorySections from "./sections/story/StorySections.vue";
import GuestInfo from "./sections/reception/GuestInfo.vue";
import AlbumSection from "./sections/album/AlbumSection.vue";
import CeremonySection from "./sections/ceremony/CeremonySection.vue";
import Colophon from "./sections/footer/Colophon.vue";
import CountdownSection from "./sections/countdown/CountdownSection.vue";
import FamiliesSection from "./sections/families/FamiliesSection.vue";
import HeroSection from "./sections/hero/HeroSection.vue";
import LetterSection from "./sections/letter/LetterSection.vue";
import SiteNav from "./sections/nav/SiteNav.vue";
import ReceptionSection from "./sections/reception/ReceptionSection.vue";
import RsvpSection from "./sections/rsvp/RsvpSection.vue";
import TimelineSection from "./sections/timeline/TimelineSection.vue";

const props = defineProps({
  entered: { type: Boolean, default: false },
});

const page = ref<HTMLElement | null>(null);
useInvitationMotion(page, () => props.entered);
</script>

<template>
  <main id="invite" ref="page" class="invite" tabindex="-1" :inert="!entered">
    <div class="sheet">
      <SiteNav />
      <HeroSection />
      <LetterSection />
      <div class="invitation-details">
        <FamiliesSection />
        <CeremonySection />
        <ReceptionSection />
      </div>
      <TimelineSection />
      <StorySections />
      <CountdownSection />
      <AlbumSection :entered="entered" />
      <GuestInfo />
      <RsvpSection />
      <Colophon />
    </div>
    <BackToTop v-if="entered" />
  </main>
</template>

<style scoped>
.invite {
  min-height: 100vh;
}

.invite:focus {
  outline: none;
}

.sheet {
  width: 100%;
  min-height: 100vh;
}
</style>
