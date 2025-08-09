package com.lerneon.backend.controllers;

import com.lerneon.backend.models.entity.BaseEntity;
import com.lerneon.backend.models.payload.response.common.SuccessResponse;
import org.springframework.http.ResponseEntity;

import java.io.Serializable;
import java.util.List;

public interface BaseController<T extends BaseEntity, ID extends Serializable> {
    default ResponseEntity<SuccessResponse<List<T>>> findAll() {
        throw new UnsupportedOperationException("Method findAll Not supported yet.");
    }

    default ResponseEntity<SuccessResponse<T>> findById(ID id) {
        throw new UnsupportedOperationException("Method findById Not supported yet.");
    }

    default ResponseEntity<SuccessResponse<T>> create(T entity) {
        throw new UnsupportedOperationException("Method create Not supported yet.");
    }

    default ResponseEntity<SuccessResponse<T>> update(ID id, T entity) {
        throw new UnsupportedOperationException("Method update Not supported yet.");
    }

    default ResponseEntity<SuccessResponse<T>> delete(ID id) {
        throw new UnsupportedOperationException("Method delete Not supported yet.");
    }
}
