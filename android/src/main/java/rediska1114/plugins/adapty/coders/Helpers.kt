package rediska1114.plugins.adapty.coders

import com.adapty.utils.ImmutableList
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject


public fun<T: Any> T.accessField(fieldName: String): Any? {
    return javaClass.getDeclaredField(fieldName).let { field ->
        field.isAccessible = true
        return@let field.get(this)
    }
}

public fun<T: Any> T.accessStaticField(fieldName: String): Any? {
    return javaClass.getDeclaredField(fieldName).let { field ->
        field.isAccessible = true
        return@let field.get(null)
    }
}

public fun <T : Any> T.setPrivateField(fieldName: String, value: Any?) {
    javaClass.getDeclaredField(fieldName).let { field ->
        field.isAccessible = true
        field.set(this, value)
    }
}


// List.toJSArray() is a helper function that converts a List of objects to a JSArray

public fun <T> List<T>.toJSArray(): JSArray {
    val jsArray = JSArray()
    forEach {
        jsArray.put(it)
    }
    return jsArray
}

public fun <T> ImmutableList<T>.toJSArray(): JSArray {
    val jsArray = JSArray()
    forEach {
        jsArray.put(it)
    }
    return jsArray
}



public fun JSObject.getJSList(key: String): List<JSObject> {
    val jsonArray = getJSONArray(key)
    val list = mutableListOf<JSObject>()
    for (i in 0 until jsonArray.length()) {
        list.add(JSObject.fromJSONObject(jsonArray.getJSONObject(i)))
    }
    return list
}