import Api from '@/services/Api'

export default {
    search(id) {
        return Api().post('search', id)
    }
}