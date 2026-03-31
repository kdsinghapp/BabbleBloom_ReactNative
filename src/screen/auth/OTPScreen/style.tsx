import { Platform, StyleSheet } from 'react-native';
import { color } from '../../../constant';
import font from '../../../theme/font';

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* ── Card ── */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 15,
  },

  /* ── Header text ── */
  txtHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
     marginBottom: 8,
  },
  txtDes: {
    color: '#9DB2BF',
    fontSize: 14,
    textAlign: 'center',
   },

  /* ── OTP field ── */
  otpFieldContainer: {
    marginTop: 28,
    marginBottom: 28,
    alignItems: 'center',
  },

  /* Square cell matching the screenshot */
  cellWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#E0E0E0',
     alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  cellWrapperFocused: {
    borderColor: '#4CAF50',   // green border for focused cell (matches screenshot)
    backgroundColor: '#FFFFFF',
  },
  cellText: {
    fontSize: 24,
    color: '#000',
     includeFontPadding: false,
    textAlignVertical: 'center',
  },

  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 13,
    textAlign: 'center',
  },

  /* ── Submit button ── */
  submitButton: {
    backgroundColor: '#D63864',   // pink/crimson from screenshot
    borderRadius: 50,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
   },

  /* ── Timer row inside card ── */
  resendRow: {
    alignItems: 'center',
    marginTop: 4,
  },
  timerText: {
    color: '#9DB2BF',
    fontSize: 14,
  },

  /* ── Resend OTP link outside card ── */
  resendLink: {
    marginTop: 32,
    alignItems: 'center',
  },
  resendLinkText: {
    color: '#1565C0',
    fontSize: 16,
    fontWeight: '600',
   },
});