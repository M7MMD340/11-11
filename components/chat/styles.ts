import { StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow } from '../../constants/theme';

export const chatStyles = StyleSheet.create({
  // Camera capture bar
  cameraBar: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  cameraCancel: { padding: 10 },
  cameraFlip: { padding: 10 },
  shutter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#ccc',
    alignSelf: 'center',
    position: 'absolute',
    left: '50%',
    marginLeft: -37,
  },

  // Caption composer
  captionBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  captionInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#fff', fontWeight: '800', fontSize: 18 },

  // Message list
  messageList: { paddingHorizontal: spacing(2), paddingVertical: spacing(1.5) },
  bubbleRow: { marginVertical: 3, flexDirection: 'row' },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubbleRowTheirs: { justifyContent: 'flex-start' },
  textBubble: {
    maxWidth: '78%',
    borderRadius: radius.md,
    paddingHorizontal: spacing(1.75),
    paddingVertical: spacing(1.25),
    ...shadow.soft,
  },
  textBubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  textBubbleTheirs: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleTextMine: { color: '#fff', fontSize: 15, textAlign: 'right' },
  bubbleTextTheirs: { color: colors.text, fontSize: 15, textAlign: 'right' },
  bubbleTime: { fontSize: 10, marginTop: 3, textAlign: 'right' },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.75)' },
  bubbleTimeTheirs: { color: colors.muted },

  photoBubble: {
    width: 150,
    height: 150,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.soft,
  },
  photoLocked: {
    width: 150,
    height: 150,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoLockedText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  photoOpenedBadge: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoOpenedText: { color: 'rgba(255,255,255,0.9)', fontSize: 10 },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing(1),
    padding: spacing(1.5),
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1.25),
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnPrimary: { backgroundColor: colors.primary },
  roundBtnGhost: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },

  empty: { textAlign: 'center', color: colors.muted, marginTop: spacing(6) },
});
