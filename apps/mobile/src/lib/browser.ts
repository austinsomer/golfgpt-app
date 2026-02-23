import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { colors } from '../constants/theme';

/**
 * Open a URL in an in-app browser modal.
 * Falls back gracefully if the URL is missing.
 */
export async function openInApp(url: string | null | undefined): Promise<void> {
  if (!url) {
    Alert.alert('No booking link available for this course.');
    return;
  }
  try {
    await WebBrowser.openBrowserAsync(url, {
      toolbarColor: colors.bgCream,
      controlsColor: colors.brandGreen,
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      showTitle: true,
    });
  } catch {
    Alert.alert('Could not open booking page. Check your internet connection and try again.');
  }
}
