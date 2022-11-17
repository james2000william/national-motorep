import { makeStore } from '@notional-finance/notionable';
import { filter } from 'rxjs';
import { initPlausible } from '@notional-finance/helpers';

export interface TrackingState {
  hasConsent: boolean;
  hasAnalyticsInit: boolean;
  impactClickId?: string;
}

export const initialTrackingState = {
  hasConsent: false,
  hasAnalyticsInit: false,
};

const {
  _store: _trackingStore,
  updateState: updateTrackingState,
  _state$: trackingState$,
  selectState: selectTrackingState,
} = makeStore<TrackingState>(initialTrackingState);

export { updateTrackingState, selectTrackingState, trackingState$ };

const _initPlausible$ = selectTrackingState('hasConsent')
  .pipe(filter((c) => c === true))
  .subscribe(() => {
    initPlausible()
    updateTrackingState({ hasAnalyticsInit: true });
  });
