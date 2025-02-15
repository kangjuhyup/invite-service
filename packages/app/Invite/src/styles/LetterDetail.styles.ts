import {StyleSheet, Dimensions} from 'react-native';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

export const styles = StyleSheet.create({
  letterImage: {
    width: '100%',
    height: '100%',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  thumbnail: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    marginVertical: 10,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  actionButtonActive: {
    backgroundColor: '#e8f0fe',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 50,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  commentsSection: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#202124',
  },
  loading: {
    padding: 20,
  },
  commentsList: {
    gap: 16,
  },
  commentItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentUserImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentUserImagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentUserImageText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
  },
  commentContent: {
    fontSize: 16,
    color: '#202124',
    lineHeight: 24,
  },
  commentDate: {
    fontSize: 12,
    color: '#5f6368',
  },
  emptyComments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCommentsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
  },
  categoryBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  floatingStats: {
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: [{translateX: -100}],
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 16,
    width: 200,
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeStatText: {
    color: '#1a73e8',
  },
});
